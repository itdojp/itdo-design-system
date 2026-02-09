export interface SavedViewRecord<TPayload = Record<string, unknown>> {
  id: string;
  name: string;
  payload: TPayload;
  shared?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedViewsStorageAdapter<TPayload = Record<string, unknown>> {
  load: () => Promise<SavedViewRecord<TPayload>[]>;
  save: (views: SavedViewRecord<TPayload>[]) => Promise<void>;
}

export interface SavedViewSharePayload {
  viewId: string;
  link: string;
}
