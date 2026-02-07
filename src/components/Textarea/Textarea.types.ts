import { TextareaHTMLAttributes } from 'react';
import type { ValidationState } from '../FormField/FormField.types';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  showCharacterCount?: boolean;
  containerClassName?: string;
}
