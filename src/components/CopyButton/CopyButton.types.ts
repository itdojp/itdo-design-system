import type { ButtonProps } from '../Button/Button.types';

export interface CopyButtonProps {
  text: string;
  label?: string;
  successLabel?: string;
  errorLabel?: string;
  timeoutMs?: number;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  className?: string;
  showStatus?: boolean;
}
