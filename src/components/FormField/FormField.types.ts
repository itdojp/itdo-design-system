import { ReactNode } from 'react';

export interface FormFieldProps {
  label?: string;
  helpText?: string;
  error?: string;
  success?: string;
  required?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  id?: string;
  className?: string;
  labelClassName?: string;
  messageClassName?: string;
  children: ReactNode;
}
