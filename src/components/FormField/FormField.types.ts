import { ReactNode } from 'react';

export type ValidationState = 'none' | 'error' | 'warning' | 'success' | 'validating';

export interface FormFieldProps {
  label?: string;
  helpText?: string;
  hint?: string;
  description?: string;
  error?: string;
  warning?: string;
  success?: string;
  validationState?: ValidationState;
  validationMessage?: string;
  required?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  id?: string;
  className?: string;
  labelClassName?: string;
  messageClassName?: string;
  footer?: ReactNode;
  children: ReactNode;
}
