import { fireEvent, render, screen } from '@testing-library/react';
import type { AttachmentRecord } from '../../types';
import { AttachmentField } from './AttachmentField';

const attachments: AttachmentRecord[] = [
  {
    id: 'img',
    name: 'image.png',
    size: 1000,
    mimeType: 'image/png',
    kind: 'image',
    status: 'uploaded',
    previewUrl: 'data:image/png;base64,iVBORw0KGgo=',
  },
  {
    id: 'pdf',
    name: 'doc.pdf',
    size: 2000,
    mimeType: 'application/pdf',
    kind: 'pdf',
    status: 'uploaded',
    previewUrl: 'data:application/pdf;base64,JVBERi0=',
  },
  {
    id: 'err',
    name: 'error.zip',
    size: 3000,
    mimeType: 'application/zip',
    kind: 'file',
    status: 'failed',
    errorMessage: 'Upload failed.',
  },
];

describe('AttachmentField', () => {
  it('renders attachments and status labels', () => {
    render(<AttachmentField attachments={attachments} />);

    expect(screen.getByText('image.png')).toBeInTheDocument();
    expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    expect(screen.getByText('Upload failed.')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('triggers retry and remove callbacks', () => {
    const onRetryAttachment = jest.fn();
    const onRemoveAttachment = jest.fn();

    render(
      <AttachmentField
        attachments={attachments}
        onRetryAttachment={onRetryAttachment}
        onRemoveAttachment={onRemoveAttachment}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetryAttachment).toHaveBeenCalledWith('err');

    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);
    expect(onRemoveAttachment).toHaveBeenCalledWith('img');
  });

  it('switches preview target when preview is requested', () => {
    const onSelectPreview = jest.fn();

    render(
      <AttachmentField
        attachments={attachments}
        selectedPreviewId="img"
        onSelectPreview={onSelectPreview}
      />
    );

    const previewButtons = screen.getAllByRole('button', { name: 'Preview' });
    fireEvent.click(previewButtons[1]);

    expect(onSelectPreview).toHaveBeenCalledWith('pdf');
  });

  it('adds selected files and resets file input value', () => {
    const onAddFiles = jest.fn();
    const file = new File(['hello'], 'evidence.txt', { type: 'text/plain' });

    render(<AttachmentField attachments={attachments} onAddFiles={onAddFiles} />);

    const fileInput = document.querySelector('.itdo-attachment-field__input') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(onAddFiles).toHaveBeenNthCalledWith(1, [file]);
    expect(onAddFiles).toHaveBeenNthCalledWith(2, [file]);
    expect(fileInput.value).toBe('');
  });

  it('renders max file size warning and supports label override', () => {
    render(
      <AttachmentField
        attachments={attachments}
        maxFileSizeBytes={1000}
        labels={{
          maxSizeWarning: (fileName) => `${fileName} is too large.`,
        }}
      />
    );

    expect(screen.getByText('doc.pdf is too large.')).toBeInTheDocument();
  });

  it('clamps uploading progress display to 0-100', () => {
    const uploading: AttachmentRecord[] = [
      {
        id: 'u1',
        name: 'u1.csv',
        size: 2000,
        mimeType: 'text/csv',
        kind: 'file',
        status: 'uploading',
        progress: 140,
      },
    ];

    render(<AttachmentField attachments={uploading} onAddFiles={jest.fn()} />);

    const bar = document.querySelector('.itdo-attachment-field__progress-bar');
    expect(bar).toHaveStyle({ width: '100%' });
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('supports generic file preview without previewUrl', () => {
    const genericUploaded: AttachmentRecord[] = [
      {
        id: 'generic',
        name: 'archive.zip',
        size: 4096,
        mimeType: 'application/zip',
        kind: 'file',
        status: 'uploaded',
      },
    ];

    render(
      <AttachmentField
        attachments={genericUploaded}
        selectedPreviewId="generic"
        onSelectPreview={jest.fn()}
      />
    );

    expect(screen.getAllByText('archive.zip')).toHaveLength(2);
    expect(screen.getByText('application/zip')).toBeInTheDocument();
    expect(screen.queryByText('Preview is available after upload is completed.')).not.toBeInTheDocument();
  });

  it('disables action buttons when callbacks are not provided', () => {
    render(<AttachmentField attachments={attachments} onAddFiles={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Retry' })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Remove' })[0]).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Preview' })[0]).toBeDisabled();
  });
});
