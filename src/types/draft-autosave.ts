export interface DraftSnapshot<TData = Record<string, unknown>> {
  payload: TData;
  savedAt: string;
  revision: number;
  hash: string;
}

export interface DraftAutosaveAdapter<TData = Record<string, unknown>> {
  load: () => Promise<DraftSnapshot<TData> | null>;
  save: (snapshot: DraftSnapshot<TData>) => Promise<void>;
  clear: () => Promise<void>;
}

export interface DraftConflictPayload<TData = Record<string, unknown>> {
  local: DraftSnapshot<TData>;
  remote: DraftSnapshot<TData>;
}
