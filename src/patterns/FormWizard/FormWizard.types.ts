import type { ReactNode } from 'react';
import type { DraftAutosaveStatus } from '../../hooks/useDraftAutosave';

export interface FormWizardStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  isComplete?: boolean;
  optional?: boolean;
  hasError?: boolean;
}

export interface FormWizardAutosaveState {
  status: DraftAutosaveStatus;
  lastSavedAt?: string;
  message?: string;
  onRestoreDraft?: () => void;
  onRetrySave?: () => void;
}

export interface FormWizardLabels {
  back?: string;
  next?: string;
  submit?: string;
  cancel?: string;
  optional?: string;
  autosavePrefix?: string;
}

export interface FormWizardProps {
  steps: FormWizardStep[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (stepId: string) => void;
  onSubmit?: () => Promise<void> | void;
  onCancel?: () => void;
  canSubmit?: boolean;
  isDirty?: boolean;
  protectUnsavedChanges?: boolean;
  autosave?: FormWizardAutosaveState;
  labels?: FormWizardLabels;
  className?: string;
}
