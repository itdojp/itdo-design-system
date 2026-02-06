import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import { ConfirmActionDialogProps } from './ConfirmActionDialog.types';
import './ConfirmActionDialog.css';

export const ConfirmActionDialog: React.FC<ConfirmActionDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  requireReason = false,
  reasonLabel = 'Reason',
  reasonRequired = true,
  reasonPlaceholder = 'Provide a reason',
  onConfirm,
  onCancel,
  confirmDisabled = false,
  className,
}) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) {
      setReason('');
    }
  }, [open]);

  const shouldRequireReason = useMemo(
    () => requireReason && reasonRequired,
    [requireReason, reasonRequired]
  );

  const isConfirmDisabled = confirmDisabled || (shouldRequireReason && reason.trim().length === 0);

  const handleConfirm = () => {
    if (isConfirmDisabled) {
      return;
    }
    if (requireReason) {
      onConfirm({ reason: reason.trim() || undefined });
      return;
    }
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      className={clsx('itdo-confirm-action-dialog', `itdo-confirm-action-dialog--${tone}`, className)}
      confirmAction={
        <Button type="submit" form="itdo-confirm-action-dialog-form" variant={tone === 'danger' ? 'danger' : 'primary'} disabled={isConfirmDisabled}>
          {confirmLabel}
        </Button>
      }
      cancelAction={
        <Button type="button" variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
      }
    >
      <form
        id="itdo-confirm-action-dialog-form"
        className="itdo-confirm-action-dialog__form"
        onSubmit={(event) => {
          event.preventDefault();
          handleConfirm();
        }}
      >
        {requireReason && (
          <Input
            label={reasonLabel}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={reasonPlaceholder}
            required={shouldRequireReason}
            fullWidth
            autoFocus
          />
        )}
      </form>
    </Dialog>
  );
};
