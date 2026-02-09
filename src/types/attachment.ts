export type AttachmentStatus =
  | 'queued'
  | 'uploading'
  | 'virus_scanning'
  | 'uploaded'
  | 'failed';

export type AttachmentKind = 'image' | 'pdf' | 'file';

export interface AttachmentRecord {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  kind: AttachmentKind;
  status: AttachmentStatus;
  progress?: number;
  previewUrl?: string;
  errorMessage?: string;
}
