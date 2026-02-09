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
});
