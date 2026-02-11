export type EntityReferenceKind =
  | 'project'
  | 'vendor'
  | 'customer'
  | 'chat_message'
  | 'document'
  | string;

export type EntityReferenceScope = 'same_project' | 'project_tree' | 'global' | string;

export interface EntityReferenceCandidate {
  id: string;
  kind: EntityReferenceKind;
  label?: string;
  deepLink?: string;
}

export interface EntityReferenceItem {
  id: string;
  kind: EntityReferenceKind;
  label: string;
  deepLink?: string;
}

export type EntityReferenceValue = EntityReferenceItem | EntityReferenceItem[] | null;

export interface EntityReferencePickerProps {
  kinds: EntityReferenceKind[];
  scope: EntityReferenceScope;
  fetchCandidates: (
    query: string,
    kind: EntityReferenceKind,
    scope: EntityReferenceScope
  ) => Promise<EntityReferenceCandidate[]> | EntityReferenceCandidate[];
  value: EntityReferenceValue;
  onChange: (next: EntityReferenceValue) => void;
  renderLabel?: (entity: EntityReferenceCandidate) => string;
  toDeepLink?: (entity: EntityReferenceCandidate) => string;
  multiple?: boolean;
  maxItems?: number;
  label?: string;
  placeholder?: string;
  noResultsText?: string;
  loadingText?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  searchDebounceMs?: number;
  className?: string;
}
