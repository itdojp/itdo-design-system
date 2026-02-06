import clsx from 'clsx';
import { DataTableToolbarProps } from './CrudList.types';
import './CrudList.css';

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  children,
  actions,
  className,
}) => {
  return (
    <div className={clsx('itdo-data-table-toolbar', className)}>
      <div className="itdo-data-table-toolbar__fields">{children}</div>
      {actions && <div className="itdo-data-table-toolbar__actions">{actions}</div>}
    </div>
  );
};
