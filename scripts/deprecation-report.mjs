#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const cwd = process.cwd();
const args = new Set(process.argv.slice(2));
const failOnFindings = args.has('--fail-on-findings');

const configPath = path.join(cwd, 'config/deprecations.json');
const outputDir = path.join(cwd, 'reports/deprecation');
const jsonOutputPath = path.join(outputDir, 'deprecation-report.json');
const markdownOutputPath = path.join(outputDir, 'deprecation-report.md');

const toPosixPath = (value) => value.split(path.sep).join('/');

const isPlainObject = (value) =>
  Boolean(value) &&
  typeof value === 'object' &&
  (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);

const normalizeConfig = (raw) => {
  if (!isPlainObject(raw)) {
    throw new Error('Invalid deprecation config: root must be an object.');
  }

  const include = Array.isArray(raw.include) ? raw.include : ['src'];
  const extensions = Array.isArray(raw.extensions) ? raw.extensions : ['.ts', '.tsx'];
  const rules = Array.isArray(raw.rules) ? raw.rules : [];

  if (rules.length === 0) {
    throw new Error('Invalid deprecation config: rules must not be empty.');
  }

  const normalizedRules = rules.map((rule, index) => {
    if (!isPlainObject(rule)) {
      throw new Error(`Invalid rule at index ${index}: must be an object.`);
    }

    const id = typeof rule.id === 'string' && rule.id.trim() ? rule.id.trim() : null;
    const description =
      typeof rule.description === 'string' && rule.description.trim()
        ? rule.description.trim()
        : null;
    const pattern =
      typeof rule.pattern === 'string' && rule.pattern.trim() ? rule.pattern.trim() : null;
    const replacement = typeof rule.replacement === 'string' ? rule.replacement.trim() : '';
    const severity =
      rule.severity === 'error' || rule.severity === 'warning' ? rule.severity : 'warning';

    if (!id || !description || !pattern) {
      throw new Error(`Invalid rule at index ${index}: id/description/pattern are required.`);
    }

    return {
      id,
      description,
      replacement,
      severity,
      matcher: new RegExp(pattern, 'gm'),
    };
  });

  return { include, extensions, rules: normalizedRules };
};

const walk = async (directoryPath) => {
  const stack = [directoryPath];
  const files = [];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === 'storybook-static' ||
          entry.name.startsWith('.')
        ) {
          continue;
        }
        stack.push(entryPath);
        continue;
      }
      files.push(entryPath);
    }
  }

  return files;
};

const getLineAndColumn = (source, index) => {
  const lines = source.slice(0, index).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
};

const toMarkdown = (report) => {
  const lines = [];
  lines.push('# Deprecation Usage Report');
  lines.push('');
  lines.push(`Generated at: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Files scanned: ${report.summary.filesScanned}`);
  lines.push(`- Rules: ${report.summary.ruleCount}`);
  lines.push(`- Findings: ${report.summary.findingCount}`);
  lines.push('');
  lines.push('| Rule | Severity | Count | Replacement |');
  lines.push('| --- | --- | ---: | --- |');
  for (const byRule of report.byRule) {
    lines.push(
      `| ${byRule.ruleId} | ${byRule.severity} | ${byRule.count} | ${
        byRule.replacement || '-'
      } |`
    );
  }
  lines.push('');

  if (report.findings.length === 0) {
    lines.push('## Findings');
    lines.push('');
    lines.push('No deprecated API usage found.');
    return lines.join('\n');
  }

  lines.push('## Findings');
  lines.push('');
  for (const byRule of report.byRule) {
    if (byRule.count === 0) continue;
    lines.push(`### ${byRule.ruleId}`);
    lines.push('');
    lines.push(byRule.description);
    lines.push('');
    const findings = report.findings.filter((finding) => finding.ruleId === byRule.ruleId);
    for (const finding of findings) {
      lines.push(
        `- \`${finding.file}:${finding.line}:${finding.column}\` ${finding.snippet || '(empty)'}`
      );
    }
    lines.push('');
  }

  return lines.join('\n');
};

const appendSummary = async (report) => {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryFile) {
    return;
  }

  const summaryLines = [
    '## Deprecation Scan',
    '',
    `- Files scanned: ${report.summary.filesScanned}`,
    `- Findings: ${report.summary.findingCount}`,
    `- Report JSON: \`${toPosixPath(path.relative(cwd, jsonOutputPath))}\``,
    `- Report Markdown: \`${toPosixPath(path.relative(cwd, markdownOutputPath))}\``,
    '',
  ];

  await fs.appendFile(summaryFile, summaryLines.join('\n'));
};

const run = async () => {
  const configRaw = JSON.parse(await fs.readFile(configPath, 'utf8'));
  const config = normalizeConfig(configRaw);

  const filesToScan = [];
  for (const relativePath of config.include) {
    const absolutePath = path.join(cwd, relativePath);
    const stat = await fs.stat(absolutePath).catch(() => null);
    if (!stat || !stat.isDirectory()) {
      continue;
    }
    const discovered = await walk(absolutePath);
    for (const filePath of discovered) {
      if (config.extensions.includes(path.extname(filePath))) {
        filesToScan.push(filePath);
      }
    }
  }

  const findings = [];

  for (const filePath of filesToScan) {
    const content = await fs.readFile(filePath, 'utf8');

    for (const rule of config.rules) {
      rule.matcher.lastIndex = 0;
      let match = rule.matcher.exec(content);
      while (match) {
        const index = match.index;
        const { line, column } = getLineAndColumn(content, index);
        findings.push({
          ruleId: rule.id,
          description: rule.description,
          severity: rule.severity,
          replacement: rule.replacement,
          file: toPosixPath(path.relative(cwd, filePath)),
          line,
          column,
          snippet: match[0].trim().slice(0, 180),
        });
        match = rule.matcher.exec(content);
      }
    }
  }

  const byRule = config.rules.map((rule) => {
    const count = findings.filter((finding) => finding.ruleId === rule.id).length;
    return {
      ruleId: rule.id,
      description: rule.description,
      severity: rule.severity,
      replacement: rule.replacement,
      count,
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      filesScanned: filesToScan.length,
      ruleCount: config.rules.length,
      findingCount: findings.length,
    },
    byRule,
    findings,
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(jsonOutputPath, JSON.stringify(report, null, 2));
  await fs.writeFile(markdownOutputPath, `${toMarkdown(report)}\n`);
  await appendSummary(report);

  console.log(
    `[deprecation-scan] files=${report.summary.filesScanned} findings=${report.summary.findingCount}`
  );
  console.log(`[deprecation-scan] json=${toPosixPath(path.relative(cwd, jsonOutputPath))}`);
  console.log(`[deprecation-scan] md=${toPosixPath(path.relative(cwd, markdownOutputPath))}`);

  if (failOnFindings && report.summary.findingCount > 0) {
    process.exitCode = 1;
  }
};

run().catch((error) => {
  console.error('[deprecation-scan] failed');
  console.error(error);
  process.exitCode = 1;
});
