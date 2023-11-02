import newRepository from "./baseRepository.js";
import localStorageRepositoryImpl from "./localStorageRepositoryImpl.js";
import {useState} from "react";

const repository = newRepository(localStorageRepositoryImpl);

export default repository;

type RepositoryActionIdle = {
  done: false
  inProgress: false,
  result: undefined,
  error: undefined
}

type RepositoryActionInProgress = {
  done: false
  inProgress: true
  result: undefined,
  error: undefined
}

type RepositoryActionResult<T> = {
  done: true
  inProgress: false,
  result: T,
  error: undefined
}

type RepositoryActionError = {
  done: true
  inProgress: false,
  result: undefined,
  error: unknown,
}

const idleState: RepositoryActionIdle = {
  done: false,
  inProgress: false,
  error: undefined,
  result: undefined
}

const inProgressState: RepositoryActionInProgress = {
  done: false,
  inProgress: true,
  error: undefined,
  result: undefined
}

function newResultState<T>(result: T): RepositoryActionResult<T> {
  return {
    done: true,
    inProgress: false,
    result,
    error: undefined
  }
}

function newErrorState(error: unknown): RepositoryActionError {
  return {
    done: true,
    inProgress: false,
    result: undefined,
    error
  }
}

type RepositoryActionState<T> = RepositoryActionIdle | RepositoryActionInProgress | RepositoryActionResult<T> | RepositoryActionError;

type UseRepositoryActionResult<A, R> = RepositoryActionState<R> & {
  invoke: (arg: A) => Promise<R>,
  reset: () => void
}

function useRepositoryAction<A, R>(supplier: (arg: A) => Promise<R>): UseRepositoryActionResult<A, R> {
  const [state, setState] = useState<RepositoryActionState<R>>(idleState);

  return {
    async invoke(arg: A): Promise<R> {
      console.log("Invoke " + supplier.name);
      if (state.inProgress) {
        throw new Error("Double invocation of " + supplier.name);
      }
      setState(inProgressState);
      return supplier(arg)
        .then(result => {
          console.log("Invoke " + supplier.name + ": Success", result);
          setState(newResultState(result));
          return result;
        })
        .catch(e => {
          console.log("Invoke " + supplier.name + ": Error", e);
          setState(newErrorState(e));
          throw e;
        })
    },
    reset() {
      setState(idleState);
    },
    ...state
  }
}

type UseRepositoryNoArgActionResult<R> = RepositoryActionState<R> & {
  invoke: () => Promise<R>,
  reset: () => void
}

function useRepositoryNoArgAction<R>(supplier: () => Promise<R>): UseRepositoryNoArgActionResult<R> {
  const x = useRepositoryAction(supplier);
  return {
    ...x,
    async invoke() {
      console.log("Invoke (no args) " + supplier.name);
      return x.invoke(undefined)
    }
  }
}

export function useGetSong() {
  return useRepositoryAction(repository.getSong);
}

export function useSaveSong() {
  return useRepositoryAction(repository.saveSong);
}

export function useGetSetlists() {
  return useRepositoryNoArgAction(repository.getSetlists);
}

export function useSaveSetlist() {
  return useRepositoryAction(repository.saveSetlist);
}
