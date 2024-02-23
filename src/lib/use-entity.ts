import {useState} from "react";
import {getEntityAction} from "./entity-action.ts";

type UseEntityResult<T> = {
  entity: T,
  save: (entity: T) => void,
  saveCount: number
}

export default function useEntity<T, S>(
  id: string,
  loadFn: () => Promise<T>,
  saveFn: (entity: T) => Promise<S>,
  reloadFn: (saveResult: S) => Promise<T>,
  afterSaveFn?: () => void
): UseEntityResult<T> {
  console.log("useEntity");

  const [saveCount, setSaveCount] = useState(0);

  const action = getEntityAction<T, S>(id);

  console.log("state: ", action.state);

  if (action.state === "error") {
    throw (action.error ?? new Error("Error state without error"));
  }

  if (action.state === "initializing") {
    console.log("start loading");

    action.state = "loading";
    action.loadPromise = loadFn()
      .then(result => {
        action.loadResult = result;
        action.state = "loaded";
      })
      .catch(e => {
        action.state = "error";
        action.error = e;
      })
      .finally(() => {
        action.loadPromise = undefined;
      })
  }

  if (action.state === "saving") {
    if (!action.savePromise) {
      throw new Error();
    }

    console.log("throw save promise");
    throw action.savePromise;
  }

  if (action.state === "saved") {
    if (!action.saveResult) {
      throw new Error();
    }

    console.log("start reloading");

    action.state = "loading";
    action.loadPromise = reloadFn(action.saveResult)
      .then(result => {
        action.loadResult = result;
        action.state = "loaded";
      })
      .catch(e => {
        action.state = "error";
        action.error = e;
      })
      .finally(() => {
        action.loadPromise = undefined;
      })
  }

  if (action.state === "loading") {
    if (!action.loadPromise) {
      throw new Error();
    }

    console.log("throw load promise");
    throw action.loadPromise;
  }

  function save(entity: T) {
    if (action.state !== "loaded") {
      throw new Error();
    }

    console.log("start saving");

    action.state = "saving";
    action.savePromise = saveFn(entity)
      .then(result => {
        action.saveResult = result;
        action.state = "saved";
        if (afterSaveFn) {
          afterSaveFn();
        }
      })
      .catch(e => {
        action.state = "error";
        action.error = e;
      })
      .finally(() => {
        action.savePromise = undefined;
      });

    setSaveCount(oldCount => oldCount + 1);
  }

  if (action.state !== "loaded") {
    throw new Error();
  }

  if (!action.loadResult) {
    throw new Error();
  }

  console.log("have loaded entity");

  return {
    entity: action.loadResult,
    save,
    saveCount
  }
}
