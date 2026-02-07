import type { ValidationState } from './FormField.types';

interface ValidationResolutionInput {
  validationState?: ValidationState;
  validationMessage?: string;
  error?: string;
  warning?: string;
  success?: string;
}

export const resolveValidationState = ({
  validationState,
  error,
  warning,
  success,
}: ValidationResolutionInput): ValidationState => {
  if (validationState) {
    return validationState;
  }

  if (error) {
    return 'error';
  }

  if (warning) {
    return 'warning';
  }

  if (success) {
    return 'success';
  }

  return 'none';
};

export const resolveValidationMessage = (
  state: ValidationState,
  { validationMessage, error, warning, success }: ValidationResolutionInput
): string | undefined => {
  if (validationMessage !== undefined) {
    return validationMessage;
  }

  if (state === 'error') {
    return error;
  }

  if (state === 'warning') {
    return warning;
  }

  if (state === 'success') {
    return success;
  }

  return undefined;
};
