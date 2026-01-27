import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useMemo, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Combobox } from '../../components/Combobox';
import { CopyButton } from '../../components/CopyButton';
import { Input } from '../../components/Input';
import { Link } from '../../components/Link';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { Popover } from '../../components/Popover';
import { Textarea } from '../../components/Textarea';
import { EventLog } from '../../patterns/EventLog';
import type { ComboboxItem } from '../../components/Combobox/Combobox.types';
import type { EventLogItem } from '../../patterns/EventLog/EventLog.types';

const meta: Meta = {
  title: 'Examples/DesignBook',
};

export default meta;

type Story = StoryObj;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card variant="outlined" padding="large">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  </Card>
);

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem' }}>
    <div style={{ display: 'grid', gap: '1.5rem' }}>{children}</div>
  </div>
);

export const ReferencePicker: Story = {
  render: () => {
    const items: ComboboxItem[] = [
      {
        id: 'ref-1',
        label: 'ERP4 / Timesheet',
        description: 'Project activity list',
        badge: 'Project',
        meta: 'Scope: Team A',
      },
      {
        id: 'ref-2',
        label: 'ERP4 / Core',
        description: 'Core data module',
        badge: 'Team',
        meta: 'Scope: Shared',
      },
      {
        id: 'ref-3',
        label: 'ITDO Portal',
        description: 'User-facing portal',
        badge: 'Service',
        meta: 'Scope: Public',
      },
    ];

    const [selected, setSelected] = useState<ComboboxItem | null>(null);

    return (
      <Wrapper>
        <Section title="Reference Picker">
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={chipStyle}>Scope: Team A</span>
              <span style={chipStyle}>Partial match</span>
              <span style={chipStyle}>Type badges</span>
            </div>
            <Combobox
              label="Reference"
              placeholder="Search reference"
              items={items}
              onSelect={(item) => setSelected(item)}
            />
            <Combobox
              label="Empty state"
              placeholder="No matches"
              items={[]}
              emptyMessage="No references found"
            />
            {selected ? (
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Selected: {selected.label} ({selected.badge})
              </div>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                No reference selected
              </div>
            )}
          </div>
        </Section>
      </Wrapper>
    );
  },
};

export const DeepLinkAndCopy: Story = {
  render: () => {
    const url = 'https://example.com/projects/123';
    const markdown = `[Project 123](${url})`;

    return (
      <Wrapper>
        <Section title="Deep Link & Copy">
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href={url} external>
                Project 123
              </Link>
              <CopyButton text={url} label="Copy URL" />
              <CopyButton text={markdown} label="Copy Markdown" />
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Use canonical deep links and label them with concise titles. Provide both URL and Markdown copy.
            </div>
          </div>
        </Section>
      </Wrapper>
    );
  },
};

export const MemoMarkdown: Story = {
  render: () => {
    const [text, setText] = useState(
      `# Memo\n\n- Keep notes concise\n- Use links for references\n\n[Portal](https://example.com)`
    );

    return (
      <Wrapper>
        <Section title="Memo (Markdown)">
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <Textarea
              label="Input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={10}
            />
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', marginBottom: '0.5rem' }}>Preview</div>
              <div style={previewStyle}>
                <MarkdownRenderer
                  content={text}
                  linkComponent={(props) => (
                    <Link {...props} external={props.href?.startsWith('http')} />
                  )}
                />
              </div>
            </div>
          </div>
        </Section>
      </Wrapper>
    );
  },
};

export const HistoryAudit: Story = {
  render: () => {
    const items: EventLogItem[] = [
      {
        id: '1',
        title: 'Request submitted',
        description: 'User action recorded in the system.',
        timestamp: '2024-10-01 09:15',
        status: 'info',
      },
      {
        id: '2',
        title: 'Validation completed',
        description: 'All required fields were validated successfully.',
        timestamp: '2024-10-01 09:16',
        status: 'success',
      },
      {
        id: '3',
        title: 'Manual override applied',
        description: 'Admin updated approval status.',
        timestamp: '2024-10-01 10:05',
        status: 'error',
        adminOverride: true,
        changes: [
          { field: 'status', before: 'Pending', after: 'Approved' },
          { field: 'approver', before: 'Auto', after: 'Admin' },
        ],
        meta: 'Operator: Admin user',
      },
    ];

    return (
      <Wrapper>
        <Section title="History / Audit">
          <EventLog items={items} labels={{ adminOverride: 'Admin override', changes: 'Changes' }} />
        </Section>
      </Wrapper>
    );
  },
};

export const PatternGallery: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const anchorRef = useRef<HTMLSpanElement>(null);
    const items = useMemo<ComboboxItem[]>(
      () => [
        { id: '1', label: 'ERP4 / Timesheet', badge: 'Project' },
        { id: '2', label: 'ERP4 / Core', badge: 'Team' },
        { id: '3', label: 'ITDO Portal', badge: 'Service' },
      ],
      []
    );

    return (
      <Wrapper>
        <Section title="Pattern Gallery">
          <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Input label="Quick Reference" placeholder="Search" fullWidth />
            <span ref={anchorRef} style={{ display: 'inline-flex' }}>
              <Button size="small" onClick={() => setOpen(true)}>Open tips</Button>
            </span>
          </div>
            <Popover
              open={open}
              onClose={() => setOpen(false)}
              anchorRef={anchorRef}
              autoFocus={false}
              role="dialog"
              ariaLabel="Reference tips"
            >
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ fontWeight: 600 }}>Tips</div>
                <div style={{ fontSize: 'var(--font-size-sm)' }}>
                  Use reference picker for scoped search and link copy for reuse.
                </div>
                <Button size="small" variant="secondary" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </Popover>
            <Combobox
              label="Reference"
              placeholder="Search reference"
              items={items}
              value={selected}
              onChange={setSelected}
            />
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link href="https://example.com" external>
                Deep link
              </Link>
              <CopyButton text="https://example.com" label="Copy URL" />
            </div>
          </div>
        </Section>
      </Wrapper>
    );
  },
};

const chipStyle: React.CSSProperties = {
  padding: '0.2rem 0.6rem',
  borderRadius: '999px',
  background: 'var(--color-bg-subtle)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
};

const previewStyle: React.CSSProperties = {
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-md)',
  padding: '1rem',
  minHeight: '240px',
  background: 'var(--color-bg-base)',
};
