import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { expect, fireEvent, within } from 'storybook/test';
import type { AttachmentRecord, EditableDataGridColumnContract, EditableGridRowRecord } from '../../types';
import { AttachmentField } from '../../patterns/AttachmentField';
import { EditableDataGrid } from '../../patterns/DataGrid/EditableDataGrid';
import { FormWizard } from '../../patterns/FormWizard';
import { createLocalStorageDraftAutosaveAdapter, useDraftAutosave } from '../../hooks/useDraftAutosave';

type TimesheetRow = EditableGridRowRecord & {
  member: string;
  project: string;
  workDate: string;
  hours: number;
  status: string;
};

const imagePreview =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="20" y="100" font-size="18" fill="%236b7280">Receipt</text></svg>';
const pdfPreview = 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp';

const resolveKind = (mimeType: string): AttachmentRecord['kind'] => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType === 'application/pdf') {
    return 'pdf';
  }
  return 'file';
};

const columns: EditableDataGridColumnContract<TimesheetRow>[] = [
  {
    key: 'member',
    header: 'Member',
    editor: { type: 'text' },
    validator: (value) => (String(value ?? '').trim().length === 0 ? 'Member is required.' : null),
  },
  {
    key: 'project',
    header: 'Project',
    editor: {
      type: 'select',
      options: [
        { label: 'ERP4 Timesheet', value: 'ERP4 Timesheet' },
        { label: 'ERP4 Core', value: 'ERP4 Core' },
      ],
    },
  },
  {
    key: 'workDate',
    header: 'Work Date',
    editor: { type: 'date' },
  },
  {
    key: 'hours',
    header: 'Hours',
    align: 'right',
    editor: { type: 'number', min: 0, max: 24, step: 0.5 },
    validator: (value) => {
      if (typeof value !== 'number') {
        return 'Hours must be numeric.';
      }
      if (value <= 0) {
        return 'Hours must be greater than 0.';
      }
      if (value > 24) {
        return 'Hours must be 24 or less.';
      }
      return null;
    },
    formatter: (value) => (typeof value === 'number' ? value.toFixed(1) : String(value ?? '')),
  },
  {
    key: 'status',
    header: 'Status',
    editor: {
      type: 'select',
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
      ],
    },
  },
];

const meta: Meta = {
  title: 'Examples/ERP4 Input Workflow',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [rows, setRows] = useState<TimesheetRow[]>([
      {
        id: 'TS-1001',
        member: 'Sato',
        project: 'ERP4 Timesheet',
        workDate: '2026-02-09',
        hours: 7.5,
        status: 'Open',
      },
    ]);
    const [attachments, setAttachments] = useState<AttachmentRecord[]>([
      {
        id: 'att-receipt',
        name: 'receipt.png',
        size: 300_000,
        mimeType: 'image/png',
        kind: 'image',
        status: 'uploaded',
        previewUrl: imagePreview,
      },
      {
        id: 'att-failed',
        name: 'evidence.zip',
        size: 4_500_000,
        mimeType: 'application/zip',
        kind: 'file',
        status: 'failed',
        errorMessage: 'Upload timeout. Retry required.',
      },
    ]);
    const [selectedPreviewId, setSelectedPreviewId] = useState<string | undefined>('att-receipt');
    const [confirmed, setConfirmed] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('Not submitted');
    const timeoutIdsRef = useRef<number[]>([]);

    useEffect(
      () => () => {
        timeoutIdsRef.current.forEach((timeoutId) => {
          window.clearTimeout(timeoutId);
        });
        timeoutIdsRef.current = [];
      },
      []
    );

    const draftValue = useMemo(
      () => ({ rows, attachments, confirmed }),
      [rows, attachments, confirmed]
    );
    const adapter = useMemo(
      () =>
        createLocalStorageDraftAutosaveAdapter<{
          rows: TimesheetRow[];
          attachments: AttachmentRecord[];
          confirmed: boolean;
        }>('storybook-erp4-input-workflow'),
      []
    );
    const autosave = useDraftAutosave({
      value: draftValue,
      adapter,
      onRestore: (payload) => {
        setRows(payload.rows);
        setAttachments(payload.attachments);
        setConfirmed(payload.confirmed);
      },
      intervalMs: 3000,
    });

    const steps = [
      {
        id: 'timesheet',
        title: 'Timesheet Rows',
        description: 'Validate and adjust working-hour rows.',
        isComplete: rows.length > 0 && rows.every((row) => Number(row.hours) > 0),
        content: (
          <EditableDataGrid<TimesheetRow>
            columns={columns}
            rows={rows}
            onSaveRow={async (payload) => {
              setRows((previous) =>
                previous.map((row) => (row.id === payload.rowId ? payload.nextRow : row))
              );
            }}
          />
        ),
      },
      {
        id: 'attachments',
        title: 'Attachments',
        description: 'Upload evidence and verify preview.',
        isComplete: attachments.some((attachment) => attachment.status === 'uploaded'),
        content: (
          <AttachmentField
            attachments={attachments}
            selectedPreviewId={selectedPreviewId}
            maxFileSizeBytes={10 * 1024 * 1024}
            onSelectPreview={setSelectedPreviewId}
            onRetryAttachment={(attachmentId) => {
              setAttachments((previous) =>
                previous.map((attachment) =>
                  attachment.id === attachmentId
                    ? { ...attachment, status: 'uploading', progress: 25, errorMessage: undefined }
                    : attachment
                )
              );

              const retryTimeoutId = window.setTimeout(() => {
                setAttachments((previous) =>
                  previous.map((attachment) =>
                    attachment.id === attachmentId
                      ? {
                          ...attachment,
                          status: 'uploaded',
                          progress: 100,
                          previewUrl:
                            attachment.kind === 'pdf'
                              ? pdfPreview
                              : attachment.kind === 'image'
                                ? imagePreview
                                : undefined,
                        }
                      : attachment
                  )
                );
              }, 500);
              timeoutIdsRef.current.push(retryTimeoutId);
            }}
            onRemoveAttachment={(attachmentId) =>
              setAttachments((previous) =>
                previous.filter((attachment) => attachment.id !== attachmentId)
              )
            }
            onAddFiles={(files) => {
              const created = files.map((file) => {
                const kind = resolveKind(file.type || 'application/octet-stream');
                return {
                  id: `generated-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                  name: file.name,
                  size: file.size,
                  mimeType: file.type || 'application/octet-stream',
                  kind,
                  status: 'uploading' as const,
                  progress: 20,
                };
              });

              setAttachments((previous) => [...previous, ...created]);
              const uploadTimeoutId = window.setTimeout(() => {
                setAttachments((previous) =>
                  previous.map((attachment) =>
                    created.some((createdAttachment) => createdAttachment.id === attachment.id)
                      ? {
                          ...attachment,
                          status: 'uploaded',
                          progress: 100,
                          previewUrl:
                            attachment.kind === 'pdf'
                              ? pdfPreview
                              : attachment.kind === 'image'
                                ? imagePreview
                                : undefined,
                        }
                      : attachment
                  )
                );
              }, 700);
              timeoutIdsRef.current.push(uploadTimeoutId);
            }}
          />
        ),
      },
      {
        id: 'review',
        title: 'Review & Submit',
        description: 'Confirm package and submit to ERP4.',
        isComplete: confirmed,
        content: (
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              I confirm the ERP4 submission package is complete.
            </label>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              Rows: {rows.length} / Attachments: {attachments.length}
            </p>
          </div>
        ),
      },
    ];

    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'var(--space-8)', display: 'grid', gap: 'var(--space-6)' }}>
        <h2 style={{ margin: 0 }} data-testid="erp4-input-workflow-title">
          ERP4 Timesheet Input Workflow
        </h2>
        <FormWizard
          steps={steps}
          autosave={{
            status: autosave.status,
            lastSavedAt: autosave.lastSavedAt,
            message: autosave.errorMessage,
            onRestoreDraft: autosave.hasRestorableDraft ? autosave.restoreDraft : undefined,
            onRetrySave: () => {
              void autosave.saveNow();
            },
          }}
          isDirty={autosave.isDirty}
          protectUnsavedChanges
          onSubmit={() => setSubmitMessage('Submitted')}
        />
        <p data-testid="erp4-input-submit-message" style={{ margin: 0 }}>
          {submitMessage}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('erp4-input-workflow-title')).toBeInTheDocument();

    fireEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(canvas.getByRole('heading', { name: 'Attachments', level: 2 })).toBeInTheDocument();

    fireEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(canvas.getByRole('heading', { name: 'Review & Submit', level: 2 })).toBeInTheDocument();

    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();

    fireEvent.click(canvas.getByLabelText('I confirm the ERP4 submission package is complete.'));
    await expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await expect(canvas.getByTestId('erp4-input-submit-message')).toHaveTextContent('Submitted');
  },
};
