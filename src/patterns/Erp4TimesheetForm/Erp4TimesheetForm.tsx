import { FormEvent, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { Combobox, type ComboboxItem } from '../../components/Combobox';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Textarea } from '../../components/Textarea';
import type { Erp4TimesheetFormProps, Erp4TimesheetFormValues } from './Erp4TimesheetForm.types';
import './Erp4TimesheetForm.css';

const projectItems: ComboboxItem[] = [
  { id: 'erp4-core', label: 'ERP4 / Core', description: 'Core domain', badge: 'Project' },
  { id: 'erp4-time', label: 'ERP4 / Timesheet', description: 'Timesheet module', badge: 'Project' },
  { id: 'erp4-approvals', label: 'ERP4 / Approvals', description: 'Approval workflow', badge: 'Project' },
];

const approverItems: ComboboxItem[] = [
  { id: 'u-001', label: 'Sato Keiko', description: 'PMO', badge: 'Approver' },
  { id: 'u-002', label: 'Tanaka Sho', description: 'Accounting', badge: 'Approver' },
  { id: 'u-003', label: 'Suzuki Mei', description: 'HR', badge: 'Approver' },
];

const createInitialValues = (): Erp4TimesheetFormValues => ({
  project: '',
  workDate: '',
  hours: '',
  approver: '',
  note: '',
});

export const Erp4TimesheetForm: React.FC<Erp4TimesheetFormProps> = ({
  className,
  onSubmit,
}) => {
  const [values, setValues] = useState<Erp4TimesheetFormValues>(createInitialValues);

  const hourNumber = Number(values.hours);
  const hourState =
    values.hours.length === 0
      ? 'none'
      : hourNumber > 10
        ? 'warning'
        : Number.isNaN(hourNumber)
          ? 'error'
          : 'success';
  const hourMessage =
    hourState === 'warning'
      ? '10時間を超える工数です。理由を備考に記載してください。'
      : hourState === 'error'
        ? '数値形式で入力してください。'
        : hourState === 'success'
          ? '入力値は有効です。'
          : undefined;

  const canSubmit = useMemo(
    () =>
      Boolean(values.project && values.workDate && values.hours && values.approver) &&
      hourState !== 'error',
    [hourState, values.approver, values.hours, values.project, values.workDate]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit?.(values);
  };

  return (
    <form className={clsx('itdo-erp4-timesheet-form', className)} onSubmit={handleSubmit}>
      <div className="itdo-erp4-timesheet-form__grid">
        <Combobox
          label="Project"
          required
          placeholder="Search project"
          items={projectItems}
          value={values.project}
          onChange={(project) => setValues((prev) => ({ ...prev, project }))}
          validationState={values.project ? 'success' : 'none'}
          validationMessage={values.project ? 'Project selected' : undefined}
          helpText="ERP4 module name で検索"
          fullWidth
        />
        <Input
          type="date"
          label="Work date"
          required
          value={values.workDate}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, workDate: event.currentTarget.value }))
          }
          validationState={values.workDate ? 'success' : 'none'}
          validationMessage={values.workDate ? 'Date selected' : undefined}
          fullWidth
        />
      </div>

      <div className="itdo-erp4-timesheet-form__grid">
        <Input
          type="number"
          min="0"
          step="0.5"
          label="Hours"
          required
          placeholder="e.g. 7.5"
          value={values.hours}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, hours: event.currentTarget.value }))
          }
          validationState={hourState}
          validationMessage={hourMessage}
          fullWidth
        />
        <Select
          label="Work type"
          required
          defaultValue=""
          placeholder="Select work type"
          fullWidth
        >
          <option value="development">Development</option>
          <option value="review">Review</option>
          <option value="meeting">Meeting</option>
          <option value="support">Support</option>
        </Select>
      </div>

      <Combobox
        label="Approver"
        required
        placeholder="Search approver"
        value={values.approver}
        onChange={(approver) => setValues((prev) => ({ ...prev, approver }))}
        loadOptions={async (query) => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          if (!query) return approverItems;
          return approverItems.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
          );
        }}
        helpText="氏名または部署名で検索"
        validationState={values.approver ? 'success' : 'none'}
        validationMessage={values.approver ? 'Approver selected' : undefined}
        fullWidth
      />

      <Textarea
        label="Work note"
        placeholder="Describe the task outcome"
        value={values.note}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, note: event.currentTarget.value }))
        }
        maxLength={200}
        helpText="監査対応のため、成果と判断理由を記載してください。"
        fullWidth
      />

      <div className="itdo-erp4-timesheet-form__actions">
        <Button type="submit" disabled={!canSubmit}>
          Submit entry
        </Button>
      </div>
    </form>
  );
};
