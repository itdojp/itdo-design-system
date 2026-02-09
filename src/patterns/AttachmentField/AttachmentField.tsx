import { useId, useMemo } from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import type { AttachmentRecord } from '../../types';
import type { AttachmentFieldProps } from './AttachmentField.types';
import './AttachmentField.css';

const formatBytes = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const statusLabel = (status: AttachmentRecord['status']) => {
  switch (status) {
    case 'queued':
      return 'Queued';
    case 'uploading':
      return 'Uploading';
    case 'virus_scanning':
      return 'Virus scanning';
    case 'uploaded':
      return 'Uploaded';
    case 'failed':
      return 'Failed';
    default:
      return status;
  }
};

const isPreviewable = (attachment: AttachmentRecord) =>
  attachment.status === 'uploaded' && Boolean(attachment.previewUrl);

export const AttachmentField = ({
  attachments,
  selectedPreviewId,
  maxFileSizeBytes,
  className,
  emptyState,
  labels,
  onAddFiles,
  onRetryAttachment,
  onRemoveAttachment,
  onSelectPreview,
}: AttachmentFieldProps) => {
  const inputId = useId();
  const resolvedLabels = {
    title: labels?.title ?? 'Attachments',
    addFiles: labels?.addFiles ?? 'Add files',
    retry: labels?.retry ?? 'Retry',
    remove: labels?.remove ?? 'Remove',
    selectPreview: labels?.selectPreview ?? 'Preview',
    previewTitle: labels?.previewTitle ?? 'Preview',
    empty: labels?.empty ?? 'No files attached.',
    maxSizeWarning:
      labels?.maxSizeWarning ??
      ((fileName: string) => `${fileName} exceeds maximum file size.`),
  };

  const selectedAttachment = useMemo(() => {
    if (selectedPreviewId) {
      return attachments.find((attachment) => attachment.id === selectedPreviewId);
    }
    return attachments.find((attachment) => isPreviewable(attachment)) ?? attachments[0];
  }, [attachments, selectedPreviewId]);

  return (
    <section className={clsx('itdo-attachment-field', className)}>
      <header className="itdo-attachment-field__header">
        <h3>{resolvedLabels.title}</h3>
        <label className="itdo-attachment-field__upload-button" htmlFor={inputId}>
          {resolvedLabels.addFiles}
        </label>
        <input
          id={inputId}
          className="itdo-attachment-field__input"
          type="file"
          multiple
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length > 0) {
              onAddFiles?.(files);
            }
            event.currentTarget.value = '';
          }}
        />
      </header>

      <div className="itdo-attachment-field__body">
        <ul className="itdo-attachment-field__list">
          {attachments.length === 0 && (
            <li className="itdo-attachment-field__empty">
              {emptyState ?? <p>{resolvedLabels.empty}</p>}
            </li>
          )}

          {attachments.map((attachment) => {
            const showMaxSizeWarning =
              maxFileSizeBytes !== undefined && attachment.size > maxFileSizeBytes;
            const isSelected = selectedAttachment?.id === attachment.id;

            return (
              <li
                key={attachment.id}
                className={clsx('itdo-attachment-field__item', {
                  'is-selected': isSelected,
                })}
              >
                <div className="itdo-attachment-field__meta">
                  <button
                    type="button"
                    className="itdo-attachment-field__name"
                    onClick={() => onSelectPreview?.(attachment.id)}
                    disabled={!isPreviewable(attachment)}
                  >
                    {attachment.name}
                  </button>
                  <p>{formatBytes(attachment.size)}</p>
                  <span className={clsx('itdo-attachment-field__status', `is-${attachment.status}`)}>
                    {statusLabel(attachment.status)}
                  </span>
                </div>

                {attachment.status === 'uploading' && (
                  <div className="itdo-attachment-field__progress">
                    <div
                      className="itdo-attachment-field__progress-bar"
                      style={{ width: `${attachment.progress ?? 0}%` }}
                    />
                    <span>{Math.round(attachment.progress ?? 0)}%</span>
                  </div>
                )}

                {attachment.status === 'failed' && attachment.errorMessage && (
                  <p className="itdo-attachment-field__error" role="alert">
                    {attachment.errorMessage}
                  </p>
                )}

                {showMaxSizeWarning && (
                  <p className="itdo-attachment-field__warning" role="alert">
                    {resolvedLabels.maxSizeWarning(attachment.name)}
                  </p>
                )}

                <div className="itdo-attachment-field__actions">
                  {attachment.status === 'failed' && (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => onRetryAttachment?.(attachment.id)}
                    >
                      {resolvedLabels.retry}
                    </Button>
                  )}
                  {isPreviewable(attachment) && (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => onSelectPreview?.(attachment.id)}
                    >
                      {resolvedLabels.selectPreview}
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => onRemoveAttachment?.(attachment.id)}
                  >
                    {resolvedLabels.remove}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="itdo-attachment-field__preview" aria-live="polite">
          <h4>{resolvedLabels.previewTitle}</h4>
          {!selectedAttachment && <p>{resolvedLabels.empty}</p>}
          {selectedAttachment && !isPreviewable(selectedAttachment) && (
            <p>Preview is available after upload is completed.</p>
          )}

          {selectedAttachment && isPreviewable(selectedAttachment) && selectedAttachment.kind === 'image' && (
            <img
              src={selectedAttachment.previewUrl}
              alt={`${selectedAttachment.name} preview`}
              className="itdo-attachment-field__preview-image"
            />
          )}

          {selectedAttachment && isPreviewable(selectedAttachment) && selectedAttachment.kind === 'pdf' && (
            <iframe
              src={selectedAttachment.previewUrl}
              title={`${selectedAttachment.name} preview`}
              className="itdo-attachment-field__preview-frame"
            />
          )}

          {selectedAttachment && isPreviewable(selectedAttachment) && selectedAttachment.kind === 'file' && (
            <div className="itdo-attachment-field__preview-generic">
              <p>{selectedAttachment.name}</p>
              <p>{selectedAttachment.mimeType}</p>
              <p>{formatBytes(selectedAttachment.size)}</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};
