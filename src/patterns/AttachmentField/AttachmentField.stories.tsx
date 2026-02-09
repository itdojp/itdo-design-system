import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import type { AttachmentRecord } from '../../types';
import { expect, fireEvent, within } from 'storybook/test';
import { AttachmentField } from './AttachmentField';

const imagePreview =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="20" y="100" font-size="18" fill="%236b7280">Image Preview</text></svg>';
const pdfPreview = 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp';

const baseAttachments: AttachmentRecord[] = [
  {
    id: 'att-1',
    name: 'screen.png',
    size: 380_000,
    mimeType: 'image/png',
    kind: 'image',
    status: 'uploaded',
    previewUrl: imagePreview,
  },
  {
    id: 'att-2',
    name: 'contract.pdf',
    size: 1_280_000,
    mimeType: 'application/pdf',
    kind: 'pdf',
    status: 'uploaded',
    previewUrl: pdfPreview,
  },
  {
    id: 'att-3',
    name: 'notes.txt',
    size: 8_500,
    mimeType: 'text/plain',
    kind: 'file',
    status: 'uploaded',
    previewUrl: 'data:text/plain;base64,SGVsbG8=',
  },
];

const meta: Meta<typeof AttachmentField> = {
  title: 'Patterns/AttachmentField',
  component: AttachmentField,
};

export default meta;

type Story = StoryObj<typeof AttachmentField>;

export const Default: Story = {
  render: () => {
    const [attachments, setAttachments] = useState(baseAttachments);
    const [selectedPreviewId, setSelectedPreviewId] = useState<string | undefined>('att-1');

    return (
      <AttachmentField
        attachments={attachments}
        selectedPreviewId={selectedPreviewId}
        onSelectPreview={setSelectedPreviewId}
        onRemoveAttachment={(attachmentId) =>
          setAttachments((previous) => previous.filter((attachment) => attachment.id !== attachmentId))
        }
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('screen.png')).toBeInTheDocument();
    fireEvent.click(canvas.getAllByRole('button', { name: 'Preview' })[1]);
    await expect(canvas.getByText('contract.pdf')).toBeInTheDocument();
  },
};

export const FailureAndRetry: Story = {
  render: () => {
    const [attachments, setAttachments] = useState<AttachmentRecord[]>([
      {
        id: 'att-fail',
        name: 'virus.zip',
        size: 2_400_000,
        mimeType: 'application/zip',
        kind: 'file',
        status: 'failed',
        errorMessage: 'Upload timeout. Retry is required.',
      },
    ]);

    return (
      <AttachmentField
        attachments={attachments}
        onRetryAttachment={(attachmentId) =>
          setAttachments((previous) =>
            previous.map((attachment) =>
              attachment.id === attachmentId
                ? { ...attachment, status: 'virus_scanning', errorMessage: undefined }
                : attachment
            )
          )
        }
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Upload timeout. Retry is required.')).toBeInTheDocument();
    fireEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(canvas.getByText('Virus scanning')).toBeInTheDocument();
  },
};

export const LargeAndSlowNetwork: Story = {
  render: () => {
    const [attachments, setAttachments] = useState<AttachmentRecord[]>([
      {
        id: 'att-large',
        name: 'archive-2026-02-09.zip',
        size: 20_000_000,
        mimeType: 'application/zip',
        kind: 'file',
        status: 'uploading',
        progress: 10,
      },
    ]);

    useEffect(() => {
      const timer = setInterval(() => {
        setAttachments((previous) =>
          previous.map((attachment) => {
            if (attachment.id !== 'att-large') {
              return attachment;
            }

            const currentProgress = attachment.progress ?? 0;
            if (currentProgress >= 100) {
              return {
                ...attachment,
                status: 'virus_scanning',
                progress: 100,
              };
            }

            return {
              ...attachment,
              status: 'uploading',
              progress: Math.min(100, currentProgress + 15),
            };
          })
        );
      }, 800);

      return () => clearInterval(timer);
    }, []);

    return <AttachmentField attachments={attachments} maxFileSizeBytes={5 * 1024 * 1024} />;
  },
};
