import type { ReactNode } from 'react';
import type { AttachmentRecord } from '../../types';

export interface AttachmentFieldLabels {
  title?: string;
  addFiles?: string;
  retry?: string;
  remove?: string;
  selectPreview?: string;
  previewTitle?: string;
  empty?: string;
  maxSizeWarning?: (fileName: string) => string;
}

export interface AttachmentFieldProps {
  attachments: AttachmentRecord[];
  selectedPreviewId?: string;
  maxFileSizeBytes?: number;
  className?: string;
  emptyState?: ReactNode;
  labels?: AttachmentFieldLabels;
  onAddFiles?: (files: File[]) => void;
  onRetryAttachment?: (attachmentId: string) => void;
  onRemoveAttachment?: (attachmentId: string) => void;
  onSelectPreview?: (attachmentId: string) => void;
}
