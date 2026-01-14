import { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  helpText?: string;
  success?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  containerClassName?: string;
}
