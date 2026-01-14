import { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helpText?: string;
  error?: string;
  success?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  containerClassName?: string;
}
