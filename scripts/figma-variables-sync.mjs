#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const cwd = process.cwd();

const parseArgs = (argv) => {
  const args = {
    input: '',
    output: 'reports/figma/design-tokens.json',
    baseline: '',
    reportJson: 'reports/figma/figma-sync-report.json',
    reportMd: 'reports/figma/figma-sync-report.md',
    failOnDiff: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--input' && next) {
      args.input = next;
      i += 1;
      continue;
    }
    if (arg === '--output' && next) {
      args.output = next;
      i += 1;
      continue;
    }
    if (arg === '--baseline' && next) {
      args.baseline = next;
      i += 1;
      continue;
    }
    if (arg === '--report-json' && next) {
      args.reportJson = next;
      i += 1;
      continue;
    }
    if (arg === '--report-md' && next) {
      args.reportMd = next;
      i += 1;
      continue;
    }
    if (arg === '--fail-on-diff') {
      args.failOnDiff = true;
      continue;
    }
  }

  return args;
};

const normalizeName = (name) =>
  name
    .trim()
    .replace(/\s+/g, '-')
    .replace(/\//g, '.')
    .replace(/\.+/g, '.')
    .replace(/^\./, '')
    .replace(/\.$/, '');

const setNestedValue = (target, pathSegments, value) => {
  let cursor = target;
  for (let i = 0; i < pathSegments.length; i += 1) {
    const key = pathSegments[i];
    if (i === pathSegments.length - 1) {
      cursor[key] = value;
      return;
    }
    if (!cursor[key] || typeof cursor[key] !== 'object' || Array.isArray(cursor[key])) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }
};

const toTokenObject = (figmaVariables) => {
  const output = {};
  const variables = Array.isArray(figmaVariables.variables) ? figmaVariables.variables : [];

  for (const variable of variables) {
    if (!variable || typeof variable !== 'object') {
      continue;
    }

    const rawName = typeof variable.name === 'string' ? variable.name : '';
    if (!rawName.trim()) {
      continue;
    }

    const normalized = normalizeName(rawName);
    const segments = normalized.split('.').filter(Boolean);
    if (segments.length === 0) {
      continue;
    }

    const hasModeValues =
      variable.values && typeof variable.values === 'object' && !Array.isArray(variable.values);
    const value = hasModeValues ? variable.values : variable.value;

    if (value === undefined) {
      continue;
    }

    setNestedValue(output, segments, value);
  }

  return output;
};

const flattenTokens = (value, prefix = [], output = {}) => {
  if (value === null || value === undefined) {
    output[prefix.join('.')] = value;
    return output;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    output[prefix.join('.')] = value;
    return output;
  }

  for (const [key, child] of Object.entries(value)) {
    flattenTokens(child, [...prefix, key], output);
  }

  return output;
};

const diffTokens = (baseline, nextTokens) => {
  const baselineFlat = flattenTokens(baseline);
  const nextFlat = flattenTokens(nextTokens);

  const added = [];
  const removed = [];
  const changed = [];

  for (const [tokenPath, nextValue] of Object.entries(nextFlat)) {
    if (!(tokenPath in baselineFlat)) {
      added.push({ path: tokenPath, value: nextValue });
      continue;
    }
    const before = baselineFlat[tokenPath];
    if (JSON.stringify(before) !== JSON.stringify(nextValue)) {
      changed.push({ path: tokenPath, before, after: nextValue });
    }
  }

  for (const [tokenPath, baselineValue] of Object.entries(baselineFlat)) {
    if (!(tokenPath in nextFlat)) {
      removed.push({ path: tokenPath, value: baselineValue });
    }
  }

  return { added, removed, changed };
};

const toMarkdown = (report) => {
  const lines = [];
  lines.push('# Figma Variables Sync Report');
  lines.push('');
  lines.push(`Generated at: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Variables: ${report.summary.variables}`);
  lines.push(`- Token leaves: ${report.summary.tokenLeaves}`);
  lines.push(`- Added: ${report.summary.added}`);
  lines.push(`- Removed: ${report.summary.removed}`);
  lines.push(`- Changed: ${report.summary.changed}`);
  lines.push('');

  const sections = [
    ['Added', report.diff.added],
    ['Removed', report.diff.removed],
    ['Changed', report.diff.changed],
  ];

  for (const [title, entries] of sections) {
    lines.push(`## ${title}`);
    lines.push('');
    if (entries.length === 0) {
      lines.push('None');
      lines.push('');
      continue;
    }
    for (const entry of entries) {
      if (title === 'Changed') {
        lines.push(`- \`${entry.path}\`: \`${JSON.stringify(entry.before)}\` -> \`${JSON.stringify(entry.after)}\``);
      } else {
        lines.push(`- \`${entry.path}\`: \`${JSON.stringify(entry.value)}\``);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
};

const appendSummary = async (report, outputPaths) => {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }

  const lines = [];
  lines.push('## Figma Sync Report');
  lines.push('');
  lines.push(`- Variables: ${report.summary.variables}`);
  lines.push(`- Token leaves: ${report.summary.tokenLeaves}`);
  lines.push(`- Added: ${report.summary.added}`);
  lines.push(`- Removed: ${report.summary.removed}`);
  lines.push(`- Changed: ${report.summary.changed}`);
  lines.push(`- JSON: \`${outputPaths.reportJson}\``);
  lines.push(`- Markdown: \`${outputPaths.reportMd}\``);
  lines.push('');

  await fs.appendFile(summaryPath, lines.join('\n'));
};

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'));

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  if (!options.input) {
    throw new Error('Missing required argument: --input <figma-variables-json>');
  }

  const inputPath = path.resolve(cwd, options.input);
  const outputPath = path.resolve(cwd, options.output);
  const reportJsonPath = path.resolve(cwd, options.reportJson);
  const reportMdPath = path.resolve(cwd, options.reportMd);
  const baselinePath = options.baseline ? path.resolve(cwd, options.baseline) : '';

  const input = await readJson(inputPath);
  const variables = Array.isArray(input.variables) ? input.variables.length : 0;
  const tokens = toTokenObject(input);

  const baseline = baselinePath
    ? await readJson(baselinePath).catch(() => ({}))
    : {};
  const diff = diffTokens(baseline, tokens);
  const leafCount = Object.keys(flattenTokens(tokens)).length;

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      variables,
      tokenLeaves: leafCount,
      added: diff.added.length,
      removed: diff.removed.length,
      changed: diff.changed.length,
    },
    diff,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.mkdir(path.dirname(reportJsonPath), { recursive: true });
  await fs.mkdir(path.dirname(reportMdPath), { recursive: true });

  await fs.writeFile(outputPath, JSON.stringify(tokens, null, 2));
  await fs.writeFile(reportJsonPath, JSON.stringify(report, null, 2));
  await fs.writeFile(reportMdPath, `${toMarkdown(report)}\n`);

  console.log(
    `[figma-sync] variables=${report.summary.variables} added=${report.summary.added} removed=${report.summary.removed} changed=${report.summary.changed}`
  );
  console.log(`[figma-sync] tokens=${path.relative(cwd, outputPath)}`);
  console.log(`[figma-sync] report-json=${path.relative(cwd, reportJsonPath)}`);
  console.log(`[figma-sync] report-md=${path.relative(cwd, reportMdPath)}`);

  await appendSummary(report, {
    reportJson: path.relative(cwd, reportJsonPath),
    reportMd: path.relative(cwd, reportMdPath),
  });

  if (options.failOnDiff && (report.summary.added + report.summary.removed + report.summary.changed) > 0) {
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error('[figma-sync] failed');
  console.error(error);
  process.exitCode = 1;
});
