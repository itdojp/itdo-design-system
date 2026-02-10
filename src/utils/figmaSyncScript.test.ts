import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const scriptPath = path.join(rootDir, 'scripts/figma-variables-sync.mjs');
const sampleInput = path.join(rootDir, 'src/test/fixtures/figma-variables.sample.json');
const sampleBaseline = path.join(rootDir, 'src/test/fixtures/design-tokens.baseline.json');

const readJson = (filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

describe('figma-variables-sync script', () => {
  it('converts figma variables and creates diff reports', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'figma-sync-'));
    const outputPath = path.join(tempDir, 'tokens.json');
    const reportJsonPath = path.join(tempDir, 'report.json');
    const reportMdPath = path.join(tempDir, 'report.md');

    execFileSync(
      'node',
      [
        scriptPath,
        '--input',
        sampleInput,
        '--baseline',
        sampleBaseline,
        '--output',
        outputPath,
        '--report-json',
        reportJsonPath,
        '--report-md',
        reportMdPath,
      ],
      { cwd: rootDir, stdio: 'pipe' }
    );

    const tokens = readJson(outputPath);
    const report = readJson(reportJsonPath);
    const markdown = fs.readFileSync(reportMdPath, 'utf8');

    expect(tokens.color.text.primary.light).toBe('#111111');
    expect(tokens.color.text.primary.dark).toBe('#f5f5f5');
    expect(tokens.radius.card.default).toBe('8px');

    expect(report.summary.variables).toBe(4);
    expect(report.summary.added).toBeGreaterThan(0);
    expect(report.summary.removed).toBeGreaterThan(0);
    expect(report.summary.changed).toBeGreaterThan(0);
    expect(markdown).toContain('# Figma Variables Sync Report');
  });

  it('returns non-zero with --fail-on-diff when diff exists', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'figma-sync-fail-'));
    const outputPath = path.join(tempDir, 'tokens.json');
    const reportJsonPath = path.join(tempDir, 'report.json');
    const reportMdPath = path.join(tempDir, 'report.md');

    const result = spawnSync(
      'node',
      [
        scriptPath,
        '--input',
        sampleInput,
        '--baseline',
        sampleBaseline,
        '--output',
        outputPath,
        '--report-json',
        reportJsonPath,
        '--report-md',
        reportMdPath,
        '--fail-on-diff',
      ],
      { cwd: rootDir, stdio: 'pipe' }
    );

    expect(result.status).toBe(1);
  });
});
