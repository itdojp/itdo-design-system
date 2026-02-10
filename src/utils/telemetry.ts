export type TelemetryResult = 'success' | 'error';

export interface TelemetryEventPayload {
  event: string;
  action: string;
  context: Record<string, unknown>;
  result: TelemetryResult;
  occurredAt: string;
  metadata?: Record<string, unknown>;
}

export interface TelemetryEventInput {
  event: string;
  action: string;
  context?: Record<string, unknown>;
  result?: TelemetryResult;
  occurredAt?: string;
  metadata?: Record<string, unknown>;
}

export interface TelemetryValidationResult {
  valid: boolean;
  errors: string[];
}

export type TelemetryTransport = (
  payload: TelemetryEventPayload
) => void | Promise<void>;

export interface EmitTelemetryOptions {
  transport?: TelemetryTransport;
  onError?: (error: unknown, payload: TelemetryEventPayload) => void;
}

export type TelemetryHookPoint =
  | 'view'
  | 'click'
  | 'submit'
  | 'open'
  | 'close'
  | 'confirm'
  | 'cancel'
  | 'filter_change'
  | 'sort_change'
  | 'page_change'
  | 'selection_change'
  | 'error';

export const telemetryHookPoints = {
  Button: ['click'],
  FormField: ['view', 'submit', 'error'],
  DataTable: ['view', 'filter_change', 'sort_change', 'page_change', 'selection_change', 'click'],
  Dialog: ['view', 'confirm', 'cancel', 'close'],
  CommandPalette: ['open', 'click', 'error'],
  UndoToast: ['view', 'click', 'error'],
  PermissionGate: ['view', 'click', 'error'],
} as const satisfies Record<string, TelemetryHookPoint[]>;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const isIsoDateTime = (value: string) => {
  if (value.length === 0) {
    return false;
  }
  return !Number.isNaN(Date.parse(value));
};

export const validateTelemetryEvent = (
  payload: unknown
): TelemetryValidationResult => {
  const errors: string[] = [];

  if (!isPlainObject(payload)) {
    return {
      valid: false,
      errors: ['payload must be an object'],
    };
  }

  if (typeof payload.event !== 'string' || payload.event.trim().length === 0) {
    errors.push('event must be a non-empty string');
  }

  if (typeof payload.action !== 'string' || payload.action.trim().length === 0) {
    errors.push('action must be a non-empty string');
  }

  if (!isPlainObject(payload.context)) {
    errors.push('context must be an object');
  }

  if (payload.result !== 'success' && payload.result !== 'error') {
    errors.push('result must be success or error');
  }

  if (typeof payload.occurredAt !== 'string' || !isIsoDateTime(payload.occurredAt)) {
    errors.push('occurredAt must be an ISO8601 datetime string');
  }

  if (payload.metadata !== undefined && !isPlainObject(payload.metadata)) {
    errors.push('metadata must be an object when provided');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const createTelemetryEvent = (
  input: TelemetryEventInput
): TelemetryEventPayload => {
  const payload: TelemetryEventPayload = {
    event: input.event,
    action: input.action,
    context: input.context ?? {},
    result: input.result ?? 'success',
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    metadata: input.metadata,
  };

  const validation = validateTelemetryEvent(payload);
  if (!validation.valid) {
    throw new Error(`Invalid telemetry payload: ${validation.errors.join('; ')}`);
  }

  return payload;
};

export const emitTelemetryEvent = async (
  input: TelemetryEventInput,
  options: EmitTelemetryOptions = {}
): Promise<TelemetryEventPayload> => {
  const payload = createTelemetryEvent(input);

  if (!options.transport) {
    return payload;
  }

  try {
    await options.transport(payload);
  } catch (error) {
    options.onError?.(error, payload);
  }

  return payload;
};
