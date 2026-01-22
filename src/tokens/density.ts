export const density = {
  comfortable: {
    controlHeight: {
      small: '32px',
      medium: '40px',
      large: '48px',
    },
    controlPaddingX: {
      small: '0.75rem',
      medium: '1rem',
      large: '1.25rem',
    },
    controlPaddingY: {
      small: '0.375rem',
      medium: '0.5rem',
      large: '0.75rem',
    },
    controlGap: {
      small: '0.25rem',
      medium: '0.5rem',
      large: '0.75rem',
    },
    datagrid: {
      rowHeight: '44px',
      cellPaddingX: '0.75rem',
      cellPaddingY: '0.5rem',
    },
  },
  compact: {
    controlHeight: {
      small: '28px',
      medium: '36px',
      large: '44px',
    },
    controlPaddingX: {
      small: '0.625rem',
      medium: '0.875rem',
      large: '1rem',
    },
    controlPaddingY: {
      small: '0.25rem',
      medium: '0.375rem',
      large: '0.5rem',
    },
    controlGap: {
      small: '0.25rem',
      medium: '0.375rem',
      large: '0.5rem',
    },
    datagrid: {
      rowHeight: '36px',
      cellPaddingX: '0.5rem',
      cellPaddingY: '0.375rem',
    },
  },
} as const;

export type DensityTokens = typeof density;
