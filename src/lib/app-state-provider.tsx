import { useAppStateReducer } from "./app-state.tsx";
import { PropsWithChildren } from "react";
import { AppState } from "../types.ts";
import {
  AppStateContext,
  AppStateDispatchContext,
} from "./app-state-context.tsx";

export type AppStateProviderProps = PropsWithChildren<{
  initialAppState?: AppState;
}>;

export function AppStateProvider({
  children,
  initialAppState,
}: AppStateProviderProps) {
  const [appState, appStateDispatch] = useAppStateReducer(initialAppState);

  return (
    <AppStateContext.Provider value={appState}>
      <AppStateDispatchContext.Provider value={appStateDispatch}>
        {children}
      </AppStateDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}
