import type { ReactNode } from 'react';
import type { InputProps } from '../Input/Input.types';
import type { ValidationState } from '../FormField/FormField.types';

export interface ComboboxItem {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  value?: string;
  meta?: ReactNode;
}

export interface ComboboxProps {
  label?: string;
  helpText?: string;
  hint?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  items?: ComboboxItem[];
  onSelect?: (item: ComboboxItem) => void;
  loadOptions?: (query: string) => Promise<ComboboxItem[]>;
  debounceMs?: number;
  loading?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  error?: string;
  warning?: string;
  success?: string;
  validationState?: ValidationState;
  validationMessage?: string;
  size?: InputProps['size'];
  className?: string;
  inputProps?: Omit<
    InputProps,
    | 'label'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'size'
    | 'disabled'
    | 'helpText'
    | 'hint'
    | 'description'
    | 'required'
    | 'fullWidth'
    | 'error'
    | 'warning'
    | 'success'
    | 'validationState'
    | 'validationMessage'
  >;
}
