import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { expect, within } from 'storybook/test';
import { tokens } from '../../tokens';

const meta: Meta = {
  title: 'Examples/Token Architecture',
};

export default meta;

type Story = StoryObj;

const primitiveRows = Object.entries(tokens.primitives).map(([group, value]) => ({
  group,
  keys: Object.keys(value).length,
}));

const statusKinds = ['success', 'warning', 'error', 'info'] as const;
const statusRows = statusKinds.map((kind) => ({
  kind,
  background: tokens.semantic.status.surface[kind],
  border: tokens.semantic.status.border[kind],
  foreground: tokens.semantic.status.text[kind],
}));

const densityRows = (['comfortable', 'compact'] as const).map((mode) => ({
  mode,
  controlHeight: tokens.density[mode].controlHeight.medium,
  tableRowHeight: tokens.density[mode].table.rowHeight,
  cardPadding: tokens.density[mode].section.cardPadding,
  filterMinWidth: tokens.density[mode].filter.controlMinWidth,
}));

const motionRows = [
  ['fast', tokens.primitives.motion.duration.fast],
  ['standard', tokens.primitives.motion.duration.standard],
  ['slow', tokens.primitives.motion.duration.slow],
  ['standard easing', tokens.primitives.motion.easing.standard],
  ['entrance easing', tokens.primitives.motion.easing.entrance],
] as const;

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 'var(--font-size-sm)',
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--space-4) var(--space-6)',
  borderBottom: '1px solid var(--color-border-strong)',
  color: 'var(--color-text-secondary)',
};

const tdStyle: CSSProperties = {
  padding: 'var(--space-4) var(--space-6)',
  borderBottom: '1px solid var(--color-border-default)',
};

export const Reference: Story = {
  render: () => (
    <div style={{ padding: 'var(--space-16)', display: 'grid', gap: 'var(--space-16)' }}>
      <section>
        <h2 style={{ margin: 0 }}>Token Inventory</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          Primitive and semantic token groups currently available in this package.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Primitive group</th>
              <th style={thStyle}>Top-level key count</th>
            </tr>
          </thead>
          <tbody>
            {primitiveRows.map((row) => (
              <tr key={row.group}>
                <td style={tdStyle}>{row.group}</td>
                <td style={tdStyle}>{row.keys}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 style={{ margin: 0 }}>Semantic Status Mapping</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          Unified `bg / border / fg` naming for status tokens.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Kind</th>
              <th style={thStyle}>Background</th>
              <th style={thStyle}>Border</th>
              <th style={thStyle}>Foreground</th>
            </tr>
          </thead>
          <tbody>
            {statusRows.map((row) => (
              <tr key={row.kind}>
                <td style={tdStyle}>{row.kind}</td>
                <td style={tdStyle}>{row.background}</td>
                <td style={tdStyle}>{row.border}</td>
                <td style={tdStyle}>{row.foreground}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 style={{ margin: 0 }}>Density Matrix</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          Baseline values for list-heavy layouts.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Mode</th>
              <th style={thStyle}>Control (md)</th>
              <th style={thStyle}>Table row</th>
              <th style={thStyle}>Card padding</th>
              <th style={thStyle}>Filter min width</th>
            </tr>
          </thead>
          <tbody>
            {densityRows.map((row) => (
              <tr key={row.mode}>
                <td style={tdStyle}>{row.mode}</td>
                <td style={tdStyle}>{row.controlHeight}</td>
                <td style={tdStyle}>{row.tableRowHeight}</td>
                <td style={tdStyle}>{row.cardPadding}</td>
                <td style={tdStyle}>{row.filterMinWidth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 style={{ margin: 0 }}>Motion Tokens</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Token</th>
              <th style={thStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            {motionRows.map(([name, value]) => (
              <tr key={name}>
                <td style={tdStyle}>{name}</td>
                <td style={tdStyle}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Token Inventory' })).toBeInTheDocument();
    await expect(canvas.getByRole('cell', { name: 'success' })).toBeInTheDocument();
    await expect(canvas.getByRole('cell', { name: 'compact' })).toBeInTheDocument();
    await expect(canvas.getByRole('cell', { name: 'standard easing' })).toBeInTheDocument();
  },
};
