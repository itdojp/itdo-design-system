import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PolicyFormBuilder } from './PolicyFormBuilder';
import type { PolicyFormSchema, PolicyFormValue } from './PolicyFormBuilder.types';

const notificationSchema: PolicyFormSchema = {
  fields: [
    { name: 'policyName', label: 'Policy name', type: 'text', required: true },
    {
      name: 'channel',
      label: 'Channel',
      type: 'select',
      required: true,
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Slack', value: 'slack' },
        { label: 'SMS', value: 'sms' },
      ],
    },
    {
      name: 'maxRetries',
      label: 'Max retries',
      type: 'number',
      min: 0,
      max: 10,
      required: true,
      validator: (current) =>
        typeof current === 'number' && current <= 10
          ? undefined
          : 'Max retries must be less than or equal to 10.',
    },
    { name: 'notifyOnWeekend', label: 'Notify on weekend', type: 'checkbox' },
    { name: 'effectiveFrom', label: 'Effective from', type: 'date' },
    { name: 'quietHours', label: 'Quiet hours JSON', type: 'json', columnSpan: 2 },
    {
      name: 'escalationGroup',
      label: 'Escalation group',
      type: 'text',
      visibleWhen: (currentValue) => Boolean(currentValue.notifyOnWeekend),
      description: 'Displayed only when weekend notification is enabled.',
      columnSpan: 2,
    },
    { name: 'notes', label: 'Notes', type: 'textarea', columnSpan: 2 },
  ],
};

const approvalTemplateSchema: PolicyFormSchema = {
  sections: [
    { id: 'basic', title: 'Template basics' },
    { id: 'routing', title: 'Routing conditions' },
    { id: 'timing', title: 'Timing' },
  ],
  fields: [
    {
      name: 'templateName',
      label: 'Template name',
      type: 'text',
      required: true,
      sectionId: 'basic',
    },
    {
      name: 'approverRole',
      label: 'Approver role',
      type: 'select',
      required: true,
      options: [
        { label: 'Team Lead', value: 'team_lead' },
        { label: 'Manager', value: 'manager' },
        { label: 'Director', value: 'director' },
      ],
      sectionId: 'basic',
    },
    {
      name: 'requireAck',
      label: 'Require acknowledgement',
      type: 'checkbox',
      sectionId: 'routing',
    },
    {
      name: 'ackGroup',
      label: 'Ack group',
      type: 'text',
      sectionId: 'routing',
      visibleWhen: (currentValue) => Boolean(currentValue.requireAck),
    },
    {
      name: 'conditions',
      label: 'Condition JSON',
      type: 'json',
      sectionId: 'routing',
      rows: 10,
      columnSpan: 2,
    },
    {
      name: 'dueAt',
      label: 'Due at',
      type: 'datetime',
      sectionId: 'timing',
    },
  ],
};

const meta: Meta<typeof PolicyFormBuilder> = {
  title: 'Patterns/PolicyFormBuilder',
  component: PolicyFormBuilder,
  args: {
    onSubmit: fn(),
    onReset: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PolicyFormBuilder>;

export const NotificationPolicy: Story = {
  render: (args) => {
    const [value, setValue] = useState<PolicyFormValue>({
      policyName: 'Ops Escalation',
      channel: 'email',
      maxRetries: 3,
      quietHours: '{\n  "start": "22:00",\n  "end": "06:00"\n}',
      notes: 'Primary policy for overnight support handoff.',
    });

    return (
      <PolicyFormBuilder
        {...args}
        schema={notificationSchema}
        value={value}
        onChange={setValue}
        layout="two-column"
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole('button', { name: 'Save policy' });
    await userEvent.click(submit);
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const ApprovalTemplateSectioned: Story = {
  render: (args) => {
    const [value, setValue] = useState<PolicyFormValue>({
      templateName: 'Procurement Standard',
      approverRole: 'manager',
      requireAck: true,
      ackGroup: 'finance-ops',
      conditions: '{\n  "minAmount": 100000,\n  "currency": "JPY"\n}',
      dueAt: '2026-02-15T18:00',
    });

    return (
      <PolicyFormBuilder
        {...args}
        schema={approvalTemplateSchema}
        value={value}
        onChange={setValue}
        layout="sectioned"
        highlightDiff
        baselineValue={{
          templateName: 'Procurement Standard',
          approverRole: 'team_lead',
          requireAck: false,
          conditions: '{\n  "minAmount": 50000\n}',
        }}
      />
    );
  },
};
