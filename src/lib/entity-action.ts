type EntityActionState =
  | "initializing"
  | "error"
  | "loading"
  | "loaded"
  | "saving"
  | "saved";

export type EntityAction<T, S> = {
  id: string;
  state: EntityActionState;
  loadResult?: T;
  saveResult?: S;
  error?: unknown;
  loadPromise?: Promise<void>;
  savePromise?: Promise<void>;
};

const cache = new Map<string, EntityAction<unknown, unknown>>();

export function getEntityAction<T, S>(id: string): EntityAction<T, S> {
  let action = cache.get(id) as EntityAction<T, S> | undefined;

  if (!action) {
    action = {
      id,
      state: "initializing",
    };
    cache.set(id, action);
  }

  return action;
}

export function clearEntityAction(id: string) {
  cache.delete(id);
}
