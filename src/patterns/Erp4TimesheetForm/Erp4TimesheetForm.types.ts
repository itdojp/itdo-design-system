export interface Erp4TimesheetFormValues {
  project: string;
  workDate: string;
  hours: string;
  workType: string;
  approver: string;
  note: string;
}

export interface Erp4TimesheetFormProps {
  className?: string;
  onSubmit?: (values: Erp4TimesheetFormValues) => void;
}
