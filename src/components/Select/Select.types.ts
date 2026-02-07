import { SelectHTMLAttributes } from 'react';
import type { ValidationState } from '../FormField/FormField.types';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helpText?: string;
  hint?: string;
  description?: string;
  error?: string;
  warning?: string;
  success?: string;
  validationState?: ValidationState;
  validationMessage?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  placeholder?: string;
  containerClassName?: string;
}
