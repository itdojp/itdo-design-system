import type { AttachmentRecord } from '../../types';

export type MentionTargetKind = 'user' | 'group' | 'role';

export interface MentionTarget {
  id: string;
  kind: MentionTargetKind;
  label: string;
}

export interface MentionComposerLimits {
  maxBodyLength: number;
  maxMentions: number;
  maxGroups: number;
}

export interface MentionComposerProps {
  body: string;
  onBodyChange: (next: string) => void;
  mentions: MentionTarget[];
  onMentionsChange: (next: MentionTarget[]) => void;
  groups: MentionTarget[];
  onGroupsChange: (next: MentionTarget[]) => void;
  requiredUsers?: MentionTarget[];
  requiredGroups?: MentionTarget[];
  requiredRoles?: MentionTarget[];
  dueAt?: string;
  onDueAtChange?: (next?: string) => void;
  attachments?: AttachmentRecord[];
  selectedPreviewId?: string;
  onAddFiles?: (files: File[]) => void;
  onRetryAttachment?: (attachmentId: string) => void;
  onRemoveAttachment?: (attachmentId: string) => void;
  onSelectPreview?: (attachmentId: string) => void;
  fetchCandidates: (
    query: string,
    kind: MentionTargetKind
  ) => Promise<MentionTarget[]> | MentionTarget[];
  onSubmit: () => void;
  onCancel?: () => void;
  placeholder?: string;
  mentionPlaceholder?: string;
  groupPlaceholder?: string;
  submitLabel?: string;
  cancelLabel?: string;
  requiredSectionLabel?: string;
  limits?: Partial<MentionComposerLimits>;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}
