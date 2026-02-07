import { InputHTMLAttributes } from 'react';
import type { ValidationState } from '../FormField/FormField.types';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  warning?: string;
  helperText?: string;
  helpText?: string;
  hint?: string;
  description?: string;
  success?: string;
  validationState?: ValidationState;
  validationMessage?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  containerClassName?: string;
}
