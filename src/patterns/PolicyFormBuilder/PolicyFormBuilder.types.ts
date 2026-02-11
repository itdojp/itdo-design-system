export type PolicyFormValue = Record<string, unknown>;

export type PolicyFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'datetime'
  | 'json';

export interface PolicySelectOption {
  label: string;
  value: string | number;
}

export interface PolicyFieldSchema {
  name: string;
  label: string;
  type: PolicyFieldType;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: PolicySelectOption[];
  sectionId?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean | ((value: PolicyFormValue) => boolean);
  visibleWhen?: (value: PolicyFormValue) => boolean;
  validator?: (fieldValue: unknown, value: PolicyFormValue) => string | undefined;
  columnSpan?: 1 | 2;
}

export interface PolicyFormSection {
  id: string;
  title: string;
  description?: string;
}

export interface PolicyFormSchema {
  fields: PolicyFieldSchema[];
  sections?: PolicyFormSection[];
}

export type PolicyFormLayout = 'single' | 'two-column' | 'sectioned';

export interface PolicyFormBuilderProps {
  schema: PolicyFormSchema;
  value: PolicyFormValue;
  onChange: (next: PolicyFormValue) => void;
  onSubmit: (next: PolicyFormValue) => void;
  onReset?: () => void;
  layout?: PolicyFormLayout;
  baselineValue?: PolicyFormValue;
  highlightDiff?: boolean;
  submitLabel?: string;
  resetLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}
