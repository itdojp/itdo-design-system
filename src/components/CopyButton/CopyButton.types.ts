import type { ButtonProps } from '../Button/Button.types';

export interface CopyButtonProps
  extends Omit<ButtonProps, 'children' | 'onClick' | 'className'> {
  text: string;
  label?: string;
  successLabel?: string;
  errorLabel?: string;
  timeoutMs?: number;
  className?: string;
  showStatus?: boolean;
}
