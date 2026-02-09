import type { SavedViewRecord } from '../../types';

export interface SavedViewBarLabels {
  title?: string;
  saveAsPlaceholder?: string;
  saveAsButton?: string;
  update?: string;
  duplicate?: string;
  share?: string;
  delete?: string;
  active?: string;
}

export interface SavedViewBarProps<TPayload = Record<string, unknown>> {
  views: SavedViewRecord<TPayload>[];
  activeViewId?: string;
  onSelectView: (viewId: string) => void;
  onSaveAs: (name: string) => void;
  onUpdateView?: (viewId: string) => void;
  onDuplicateView?: (viewId: string) => void;
  onShareView?: (viewId: string) => void;
  onDeleteView?: (viewId: string) => void;
  disabled?: boolean;
  labels?: SavedViewBarLabels;
  className?: string;
}
