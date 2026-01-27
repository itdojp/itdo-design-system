import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';
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
    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        <Button ref={anchorRef} size="small" onClick={() => setOpen((prev) => !prev)}>
          Open menu
        </Button>
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
      <div style={{ maxWidth: 320 }}>
        <Input
          ref={anchorRef}
          label="Search"
          placeholder="Type to search"
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
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
    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        <Button ref={anchorRef} size="small" variant="secondary" onClick={() => setOpen(true)}>
          Show help
        </Button>
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          anchorRef={anchorRef}
          placement="right"
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
