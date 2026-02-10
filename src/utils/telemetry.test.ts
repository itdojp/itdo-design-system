import {
  createTelemetryEvent,
  emitTelemetryEvent,
  telemetryHookPoints,
  validateTelemetryEvent,
} from './telemetry';

describe('telemetry utils', () => {
  it('creates a valid payload with defaults', () => {
    const payload = createTelemetryEvent({
      event: 'ds.sample.view',
      action: 'view',
      context: {
        surface: 'storybook',
      },
    });

    expect(payload.result).toBe('success');
    expect(payload.context.surface).toBe('storybook');
    expect(typeof payload.occurredAt).toBe('string');
  });

  it('validates payload shape and returns descriptive errors', () => {
    const result = validateTelemetryEvent({
      event: '',
      action: '',
      context: null,
      result: 'pending',
      occurredAt: 'invalid',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        'event must be a non-empty string',
        'action must be a non-empty string',
        'context must be an object',
        'result must be success or error',
        'occurredAt must be an ISO8601 datetime string',
      ])
    );
  });

  it('emits payload via transport', async () => {
    const transport = jest.fn();

    const payload = await emitTelemetryEvent(
      {
        event: 'ds.sample.click',
        action: 'click',
        context: { target: 'button' },
        result: 'success',
        occurredAt: '2026-02-10T00:00:00.000Z',
      },
      { transport }
    );

    expect(transport).toHaveBeenCalledTimes(1);
    expect(transport).toHaveBeenCalledWith(payload);
    expect(payload.event).toBe('ds.sample.click');
  });

  it('swallows transport errors via onError callback', async () => {
    const onError = jest.fn();

    await emitTelemetryEvent(
      {
        event: 'ds.sample.error',
        action: 'submit',
        context: { target: 'form' },
      },
      {
        transport: async () => {
          throw new Error('network');
        },
        onError,
      }
    );

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('exposes hook points for major components', () => {
    expect(telemetryHookPoints.Button).toEqual(expect.arrayContaining(['click']));
    expect(telemetryHookPoints.DataTable).toEqual(
      expect.arrayContaining(['filter_change', 'sort_change', 'page_change'])
    );
    expect(telemetryHookPoints.Dialog).toEqual(
      expect.arrayContaining(['view', 'confirm', 'cancel'])
    );
  });
});
