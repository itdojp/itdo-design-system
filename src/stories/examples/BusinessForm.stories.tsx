import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Textarea } from '../../components/Textarea';

const meta: Meta = {
  title: 'Examples/BusinessForm',
};

export default meta;

type Story = StoryObj;

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem' }}>{children}</div>
);

export const Default: Story = {
  render: () => (
    <Wrapper>
      <Card variant="outlined" padding="large">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>Work log</h2>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-secondary)' }}>
              Submit daily activity details.
            </p>
          </div>
          <Input label="Project" placeholder="Project name" fullWidth />
          <Select label="Category" placeholder="Select category" fullWidth>
            <option value="dev">Development</option>
            <option value="design">Design</option>
            <option value="review">Review</option>
          </Select>
          <Input label="Hours" placeholder="0.0" type="number" fullWidth />
          <Textarea label="Details" placeholder="Describe the work" fullWidth />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary">Cancel</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </Card>
    </Wrapper>
  ),
};
