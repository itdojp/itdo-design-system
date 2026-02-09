export interface CommandActionEventPayload {
  actionId: string;
  label: string;
  group?: string;
  query: string;
  triggeredAt: string;
}
