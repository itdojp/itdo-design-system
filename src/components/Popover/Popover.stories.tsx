import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Menu: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLSpanElement>(null);

    return (
      <>
        <span ref={anchorRef} style={{ display: 'inline-flex' }}>
          <Button size="small" onClick={() => setOpen((prev) => !prev)}>
            Open menu
          </Button>
        </span>
        <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef}>
          <div className="itdo-popover__list">
            <button className="itdo-popover__item" type="button">Edit</button>
            <button className="itdo-popover__item" type="button">Duplicate</button>
            <button className="itdo-popover__item" type="button">Archive</button>
          </div>
        </Popover>
      </>
    );
  },
};

export const Combobox: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLInputElement>(null);

    return (
      <div
        style={{ maxWidth: 320 }}
        onFocus={() => setOpen(true)}
        onBlur={(event) => {
          const next = event.relatedTarget as Node | null;
          if (!event.currentTarget.contains(next)) {
            setOpen(false);
          }
        }}
      >
        <Input
          ref={anchorRef}
          label="Search"
          placeholder="Type to search"
        />
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          anchorRef={anchorRef}
          placement="bottom-start"
          autoFocus={false}
        >
          <div className="itdo-popover__list">
            <button className="itdo-popover__item" type="button">
              <span>ERP4 / Timesheet</span>
              <span className="itdo-popover__meta">Project</span>
            </button>
            <button className="itdo-popover__item" type="button">
              <span>ERP4 / Core</span>
              <span className="itdo-popover__meta">Team</span>
            </button>
            <button className="itdo-popover__item" type="button">
              <span>ITDO Portal</span>
              <span className="itdo-popover__meta">Service</span>
            </button>
          </div>
        </Popover>
      </div>
    );
  },
};

export const Help: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLSpanElement>(null);

    return (
      <>
        <span ref={anchorRef} style={{ display: 'inline-flex' }}>
          <Button size="small" variant="secondary" onClick={() => setOpen(true)}>
            Show help
          </Button>
        </span>
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          anchorRef={anchorRef}
          placement="right"
          ariaLabel="Help"
        >
          <div className="itdo-popover__help">
            <strong>Reference picker</strong>
            <span>Use keyboard arrows to navigate candidates.</span>
            <Button size="small" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </Popover>
      </>
    );
  },
};
