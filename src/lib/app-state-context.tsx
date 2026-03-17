import { Action } from "./app-state.tsx";
import { createContext, Dispatch } from "react";
import { AppState } from "../types.ts";

export const AppStateContext = createContext<AppState | null>(null);
export const AppStateDispatchContext = createContext<Dispatch<Action> | null>(
  null,
);
