import {AppState, isAppState} from "../types.ts";

export function storeAppState(appState: AppState) {
  localStorage.setItem("metronome.appState", JSON.stringify(appState));
}

export function loadAppState(): AppState | undefined {
  const possibleAppStateJson = localStorage.getItem("metronome.appState");

  if (!possibleAppStateJson) {
    return undefined;
  }

  const possibleAppState = JSON.parse(possibleAppStateJson);

  if (!isAppState(possibleAppState)) {
    console.warn("Ignoring app state from local storage. Type check failed.")
    return undefined;
  }

  return possibleAppState;
}
