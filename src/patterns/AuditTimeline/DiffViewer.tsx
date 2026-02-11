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

const toLines = (value: string) => value.split('\n');

const createDiff = (beforeLines: string[], afterLines: string[]): DiffLine[] => {
  const diff: DiffLine[] = [];
  let beforeIndex = 0;
  let afterIndex = 0;

  while (beforeIndex < beforeLines.length || afterIndex < afterLines.length) {
    const beforeLine = beforeLines[beforeIndex];
    const afterLine = afterLines[afterIndex];

    if (beforeLine === afterLine) {
      diff.push({
        type: 'context',
        beforeLine: beforeIndex + 1,
        afterLine: afterIndex + 1,
        text: beforeLine ?? '',
      });
      beforeIndex += 1;
      afterIndex += 1;
      continue;
    }

    const nextAfter = afterLines[afterIndex + 1];
    const nextBefore = beforeLines[beforeIndex + 1];

    if (beforeLine === nextAfter) {
      diff.push({
        type: 'add',
        afterLine: afterIndex + 1,
        text: afterLine ?? '',
      });
      afterIndex += 1;
      continue;
    }

    if (afterLine === nextBefore) {
      diff.push({
        type: 'remove',
        beforeLine: beforeIndex + 1,
        text: beforeLine ?? '',
      });
      beforeIndex += 1;
      continue;
    }

    if (beforeLine !== undefined) {
      diff.push({
        type: 'remove',
        beforeLine: beforeIndex + 1,
        text: beforeLine,
      });
      beforeIndex += 1;
    }

    if (afterLine !== undefined) {
      diff.push({
        type: 'add',
        afterLine: afterIndex + 1,
        text: afterLine,
      });
      afterIndex += 1;
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

  const threshold = compact ? Math.min(maxVisibleLines, 80) : maxVisibleLines;
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
        <pre className="itdo-diff-viewer__pre">
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
        </pre>
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
