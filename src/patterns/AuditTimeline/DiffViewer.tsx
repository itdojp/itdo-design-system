import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { DiffViewerProps } from './AuditTimeline.types';
import './AuditTimeline.css';

type DiffLineType = 'context' | 'add' | 'remove';

interface DiffLine {
  type: DiffLineType;
  beforeLine?: number;
  afterLine?: number;
  text: string;
}

const stringifySource = (value: unknown, format: 'text' | 'json') => {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'string') {
    if (format === 'json') {
      try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return value;
      }
    }
    return value;
  }
  if (format === 'json') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

const normalizeNewlines = (value: string) => value.replace(/\r\n?/g, '\n');

const toLines = (value: string) => normalizeNewlines(value).split('\n');

const createDiff = (beforeLines: string[], afterLines: string[]): DiffLine[] => {
  const beforeLength = beforeLines.length;
  const afterLength = afterLines.length;

  const lcs: number[][] = Array.from({ length: beforeLength + 1 }, () =>
    Array.from({ length: afterLength + 1 }, () => 0)
  );

  for (let beforeIndex = beforeLength - 1; beforeIndex >= 0; beforeIndex -= 1) {
    for (let afterIndex = afterLength - 1; afterIndex >= 0; afterIndex -= 1) {
      if (beforeLines[beforeIndex] === afterLines[afterIndex]) {
        lcs[beforeIndex][afterIndex] = lcs[beforeIndex + 1][afterIndex + 1] + 1;
      } else {
        lcs[beforeIndex][afterIndex] = Math.max(
          lcs[beforeIndex + 1][afterIndex],
          lcs[beforeIndex][afterIndex + 1]
        );
      }
    }
  }

  const diff: DiffLine[] = [];
  let beforeIndex = 0;
  let afterIndex = 0;
  let beforeLineNumber = 1;
  let afterLineNumber = 1;

  while (beforeIndex < beforeLength || afterIndex < afterLength) {
    if (
      beforeIndex < beforeLength &&
      afterIndex < afterLength &&
      beforeLines[beforeIndex] === afterLines[afterIndex]
    ) {
      diff.push({
        type: 'context',
        beforeLine: beforeLineNumber,
        afterLine: afterLineNumber,
        text: beforeLines[beforeIndex] ?? '',
      });
      beforeIndex += 1;
      afterIndex += 1;
      beforeLineNumber += 1;
      afterLineNumber += 1;
      continue;
    }

    if (
      afterIndex < afterLength &&
      (beforeIndex === beforeLength || lcs[beforeIndex][afterIndex + 1] >= lcs[beforeIndex + 1][afterIndex])
    ) {
      diff.push({
        type: 'add',
        afterLine: afterLineNumber,
        text: afterLines[afterIndex] ?? '',
      });
      afterIndex += 1;
      afterLineNumber += 1;
      continue;
    }

    if (beforeIndex < beforeLength) {
      diff.push({
        type: 'remove',
        beforeLine: beforeLineNumber,
        text: beforeLines[beforeIndex] ?? '',
      });
      beforeIndex += 1;
      beforeLineNumber += 1;
    }
  }

  return diff;
};

export const DiffViewer = ({
  before,
  after,
  format = 'text',
  compact = false,
  maxVisibleLines = 200,
  className,
}: DiffViewerProps) => {
  const [expanded, setExpanded] = useState(false);

  const lines = useMemo(() => {
    const beforeText = stringifySource(before, format);
    const afterText = stringifySource(after, format);
    return createDiff(toLines(beforeText), toLines(afterText));
  }, [after, before, format]);

  const normalizedMaxVisibleLines = Number.isFinite(maxVisibleLines)
    ? Math.floor(maxVisibleLines)
    : 0;
  const rawThreshold = compact ? Math.min(normalizedMaxVisibleLines, 80) : normalizedMaxVisibleLines;
  const threshold = rawThreshold > 0 ? rawThreshold : lines.length;
  const canCollapse = lines.length > threshold;
  const visibleLines = !canCollapse || expanded ? lines : lines.slice(0, threshold);
  const hiddenCount = canCollapse ? lines.length - threshold : 0;

  return (
    <section className={clsx('itdo-diff-viewer', { 'is-compact': compact }, className)}>
      <header className="itdo-diff-viewer__header">
        <h3>Diff ({format.toUpperCase()})</h3>
        <p>{lines.length} lines</p>
      </header>
      <div className="itdo-diff-viewer__surface" role="region" aria-label="Diff output">
        <div className="itdo-diff-viewer__rows">
          {visibleLines.map((line, index) => (
            <div
              key={`${index}-${line.beforeLine ?? 0}-${line.afterLine ?? 0}`}
              className={clsx('itdo-diff-viewer__line', `itdo-diff-viewer__line--${line.type}`)}
            >
              <span className="itdo-diff-viewer__line-number">
                {line.beforeLine ?? ''}
              </span>
              <span className="itdo-diff-viewer__line-number">
                {line.afterLine ?? ''}
              </span>
              <span className="itdo-diff-viewer__prefix">
                {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
              </span>
              <code className="itdo-diff-viewer__code">{line.text || ' '}</code>
            </div>
          ))}
        </div>
      </div>
      {canCollapse && (
        <div className="itdo-diff-viewer__collapse">
          <button type="button" onClick={() => setExpanded((previous) => !previous)}>
            {expanded ? 'Show less' : `Show ${hiddenCount} more lines`}
          </button>
        </div>
      )}
    </section>
  );
};
