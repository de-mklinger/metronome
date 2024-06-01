import { Dispatch, useContext, useMemo } from "react";
import { AppState, Config, NewSong, SetlistWithSongs, Song } from "../types.ts";
import {
  Action,
  AppStateContext,
  AppStateDispatchContext,
  MutableAppState,
} from "./app-state.tsx";

export function useAppState(): MutableAppState {
  const appState = useContext(AppStateContext);
  const appStateDispatch = useContext(AppStateDispatchContext);

  if (!appState || !appStateDispatch) {
    throw new Error();
  }

  return useMemo(
    () => newMutableAppState(appState, appStateDispatch),
    [appState, appStateDispatch],
  );
}

function newMutableAppState(
  appState: AppState,
  appStateDispatch: Dispatch<Action>,
): MutableAppState {
  return {
    get config() {
      return appState.config;
    },
    set config(config: Config) {
      appStateDispatch({ type: "setConfig", payload: config });
    },
    get song() {
      return appState.song;
    },
    set song(song: Song | NewSong) {
      appStateDispatch({ type: "setSong", payload: song });
    },
    setBpm(bpm: number) {
      appStateDispatch({ type: "setBpm", payload: bpm });
    },
    get setlist() {
      return appState.setlist;
    },
    set setlist(setlist: SetlistWithSongs | undefined) {
      appStateDispatch({ type: "setSetlist", payload: setlist });
    },
    get songIdx() {
      return appState.songIdx ?? 0;
    },
    set songIdx(songIdx: number) {
      appStateDispatch({ type: "setSongIdx", payload: songIdx });
    },
    nextSong() {
      appStateDispatch({ type: "nextSong" });
    },
    previousSong() {
      appStateDispatch({ type: "previousSong" });
    },
  };
}
