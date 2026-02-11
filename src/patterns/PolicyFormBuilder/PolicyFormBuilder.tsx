import type { FormEvent } from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Textarea } from '../../components/Textarea';
import type {
  PolicyFieldSchema,
  PolicyFormBuilderProps,
  PolicyFormValue,
} from './PolicyFormBuilder.types';
import './PolicyFormBuilder.css';

const isEmpty = (value: unknown) => {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
};

const isValidJson = (value: unknown) => {
  if (isEmpty(value)) {
    return true;
  }
  if (typeof value !== 'string') {
    return true;
  }
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

const resolveFieldError = (field: PolicyFieldSchema, value: PolicyFormValue) => {
  const current = value[field.name];

  if (field.required) {
    if (field.type === 'checkbox') {
      if (!current) {
        return `${field.label} is required.`;
      }
    } else if (isEmpty(current)) {
      return `${field.label} is required.`;
    }
  }

  if (field.type === 'json' && !isValidJson(current)) {
    return `${field.label} must be valid JSON.`;
  }

  if (field.validator) {
    return field.validator(current, value);
  }

  return undefined;
};

const normalizeSubmitValue = (value: PolicyFormValue, fields: PolicyFieldSchema[]) => {
  const next: PolicyFormValue = { ...value };

  fields.forEach((field) => {
    if (field.type !== 'json') {
      return;
    }
    const current = next[field.name];
    if (typeof current === 'string' && current.trim().length > 0 && isValidJson(current)) {
      next[field.name] = JSON.parse(current);
    }
  });

  return next;
};

const isFieldVisible = (field: PolicyFieldSchema, value: PolicyFormValue) =>
  field.visibleWhen ? field.visibleWhen(value) : true;

const isFieldDisabled = (
  field: PolicyFieldSchema,
  value: PolicyFormValue,
  disabled: boolean,
  readOnly: boolean
) => {
  if (disabled) {
    return true;
  }
  if (typeof field.disabled === 'function') {
    return field.disabled(value);
  }
  if (field.disabled) {
    return true;
  }
  if (readOnly && (field.type === 'checkbox' || field.type === 'select')) {
    return true;
  }
  return false;
};

const formatJsonFieldValue = (value: unknown) => {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '';
  }
};

export const PolicyFormBuilder = ({
  schema,
  value,
  onChange,
  onSubmit,
  onReset,
  layout = 'single',
  baselineValue,
  highlightDiff = false,
  submitLabel = 'Save policy',
  resetLabel = 'Reset',
  disabled = false,
  readOnly = false,
  className,
}: PolicyFormBuilderProps) => {
  const visibleFields = schema.fields.filter((field) => isFieldVisible(field, value));
  const fieldErrors = Object.fromEntries(
    visibleFields
      .map((field) => [field.name, resolveFieldError(field, value)])
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
  const aggregateErrors = Object.entries(fieldErrors).map(([name, message]) => ({ name, message }));

  const updateValue = (fieldName: string, fieldValue: unknown) => {
    onChange({
      ...value,
      [fieldName]: fieldValue,
    });
  };

  const renderField = (field: PolicyFieldSchema) => {
    const currentValue = value[field.name];
    const isDisabled = isFieldDisabled(field, value, disabled, readOnly);
    const error = fieldErrors[field.name];
    const isChanged =
      highlightDiff &&
      baselineValue &&
      JSON.stringify(currentValue ?? null) !== JSON.stringify(baselineValue[field.name] ?? null);
    const wrapperClass = clsx('itdo-policy-form-builder__field', {
      'itdo-policy-form-builder__field--span-2': field.columnSpan === 2,
      'is-changed': Boolean(isChanged),
    });

    if (field.type === 'checkbox') {
      return (
        <div key={field.name} className={wrapperClass}>
          <FormField
            label={field.label}
            helpText={field.description}
            error={error}
            required={field.required}
          >
            <input
              type="checkbox"
              checked={Boolean(currentValue)}
              disabled={isDisabled}
              onChange={(event) => updateValue(field.name, event.currentTarget.checked)}
            />
          </FormField>
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div key={field.name} className={wrapperClass}>
          <Select
            label={field.label}
            helpText={field.description}
            error={error}
            required={field.required}
            disabled={isDisabled}
            fullWidth
            value={String(currentValue ?? '')}
            onChange={(event) => {
              const selectedValue = event.currentTarget.value;
              const selectedOption = field.options?.find(
                (option) => String(option.value) === selectedValue
              );
              updateValue(field.name, selectedOption ? selectedOption.value : selectedValue);
            }}
          >
            <option value="" disabled hidden>
              {field.placeholder ?? 'Select an option'}
            </option>
            {field.options?.map((option) => (
              <option key={`${field.name}-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      );
    }

    if (field.type === 'textarea' || field.type === 'json') {
      return (
        <div key={field.name} className={wrapperClass}>
          <Textarea
            label={field.label}
            helpText={field.description}
            error={error}
            required={field.required}
            disabled={isDisabled}
            readOnly={readOnly}
            fullWidth
            rows={field.rows ?? (field.type === 'json' ? 8 : 4)}
            placeholder={field.placeholder}
            value={field.type === 'json' ? formatJsonFieldValue(currentValue) : String(currentValue ?? '')}
            onChange={(event) => updateValue(field.name, event.currentTarget.value)}
          />
        </div>
      );
    }

    const inputType =
      field.type === 'date' ? 'date' : field.type === 'datetime' ? 'datetime-local' : field.type;

    return (
      <div key={field.name} className={wrapperClass}>
        <Input
          label={field.label}
          helpText={field.description}
          error={error}
          required={field.required}
          disabled={isDisabled}
          readOnly={readOnly}
          fullWidth
          type={inputType}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step}
          value={String(currentValue ?? '')}
          onChange={(event) => {
            if (field.type === 'number') {
              const raw = event.currentTarget.value;
              updateValue(field.name, raw === '' ? undefined : Number(raw));
              return;
            }
            updateValue(field.name, event.currentTarget.value);
          }}
        />
      </div>
    );
  };

  const renderFieldGroup = (fields: PolicyFieldSchema[]) => (
    <div
      className={clsx('itdo-policy-form-builder__grid', {
        'itdo-policy-form-builder__grid--two-column': layout === 'two-column',
      })}
    >
      {fields.map((field) => renderField(field))}
    </div>
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled || readOnly || aggregateErrors.length > 0) {
      return;
    }
    onSubmit(normalizeSubmitValue(value, visibleFields));
  };

  return (
    <form className={clsx('itdo-policy-form-builder', className)} onSubmit={handleSubmit}>
      {aggregateErrors.length > 0 && (
        <section className="itdo-policy-form-builder__errors" role="alert" aria-live="polite">
          <h3>Validation errors</h3>
          <ul>
            {aggregateErrors.map((errorItem) => (
              <li key={errorItem.name}>{errorItem.message}</li>
            ))}
          </ul>
        </section>
      )}

      {layout === 'sectioned' && schema.sections && schema.sections.length > 0 ? (
        <div className="itdo-policy-form-builder__sections">
          {schema.sections.map((section) => {
            const sectionFields = visibleFields.filter((field) => field.sectionId === section.id);
            if (sectionFields.length === 0) {
              return null;
            }

            return (
              <section key={section.id} className="itdo-policy-form-builder__section">
                <header className="itdo-policy-form-builder__section-header">
                  <h3>{section.title}</h3>
                  {section.description && <p>{section.description}</p>}
                </header>
                {renderFieldGroup(sectionFields)}
              </section>
            );
          })}
          {renderFieldGroup(visibleFields.filter((field) => !field.sectionId))}
        </div>
      ) : (
        renderFieldGroup(visibleFields)
      )}

      <div className="itdo-policy-form-builder__actions">
        {onReset && (
          <Button type="button" variant="secondary" onClick={onReset} disabled={disabled || readOnly}>
            {resetLabel}
          </Button>
        )}
        <Button type="submit" disabled={disabled || readOnly || aggregateErrors.length > 0}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
