import type { ReactNode } from 'react';
import type { CommandActionEventPayload } from '../../types';

export interface CommandPaletteAction {
  id: string;
  label: string;
  group?: string;
  description?: string;
  shortcut?: string;
  keywords?: string[];
  disabled?: boolean;
  icon?: ReactNode;
  onSelect?: (action: CommandPaletteAction) => void;
}

export interface CommandPaletteResolvedAction extends CommandPaletteAction {
  isRecent?: boolean;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: CommandPaletteAction[];
  title?: ReactNode;
  placeholder?: string;
  emptyMessage?: ReactNode;
  ariaLabel?: string;
  className?: string;
  maxResults?: number;
  hotkey?: boolean;
  onActionRun?: (action: CommandPaletteAction, payload: CommandActionEventPayload) => void;
}
