import { defaultAppState, defaultSong } from "./env.ts";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useReducer,
} from "react";
import { AppState, Config, NewSong, SetlistWithSongs, Song } from "../types.ts";
import {storeAppState} from "./app-state-storage.ts";

function savingAppStateReducer(appState: AppState, action: Action) {
  // TODO only store non-default config values

  const newAppState = appStateReducer(appState, action);
  if (newAppState) {
    //console.log("New app state", newAppState);
    if (appState) {
      storeAppState(appState);
    } else {
      console.log("Not saving app state after initial set");
    }
    return newAppState;
  } else {
    console.warn("Reducer returned no app state on action", action);
    return appState;
  }
}

export type Action =
  | { type: "setAppState"; payload: AppState }
  | { type: "setConfig"; payload: Config }
  | { type: "setSong"; payload: Song | NewSong }
  | { type: "setBpm"; payload: number }
  | { type: "setSetlist"; payload: SetlistWithSongs | undefined }
  | { type: "nextSong" }
  | { type: "previousSong" }
  | { type: "setSongIdx"; payload: number };

export type AppStateDispatch = React.Dispatch<Action>;

export type AppStateProps<T = unknown> = T & {
  appState: AppState;
  appStateDispatch: AppStateDispatch;
};

function appStateReducer(appState: AppState, action: Action): AppState {
  //console.log("app state action:", action);

  const type = action.type;

  switch (type) {
    case "setAppState":
      return { ...action.payload };
    case "setConfig":
      return withConfig(action.payload);
    case "setSong":
      return withSong(action.payload);
    case "setBpm":
      return withBpm(action.payload);
    case "setSetlist":
      return withSetlist(action.payload);
    case "nextSong":
      return withNextSong();
    case "previousSong":
      return withPreviousSong();
    case "setSongIdx":
      return withSongIdx(action.payload);
    default:
      throw new Error("Unsupported action type:" + type);
  }

  function withConfig(newConfig: Config): AppState {
    return {
      ...appState,
      config: { ...newConfig },
    };
  }

  function withSong(newSong: Song | NewSong): AppState {
    return {
      ...appState,
      song: { ...newSong },
    };
  }

  function withBpm(bpm: number): AppState {
    if (bpm === appState.song.bpm) {
      return appState;
    }
    const newSong = {
      ...appState.song,
      bpm: bpm,
    };
    return withSong(newSong);
  }

  function withSetlist(newSetlist: SetlistWithSongs | undefined): AppState {
    let newSongIdx = 0;
    if (newSetlist) {
      // keep songIdx if same setlist and idx is ok
      if (
        appState.songIdx !== undefined &&
        appState.setlist &&
        appState.setlist.id === newSetlist.id &&
        appState.setlist.songIds.length > appState.songIdx
      ) {
        newSongIdx = appState.songIdx;
      }
      return {
        ...appState,
        setlist: newSetlist,
        songIdx: newSongIdx,
        song: getActiveSong(newSetlist, newSongIdx),
      };
    } else {
      // detach song:
      return {
        ...appState,
        setlist: undefined,
        songIdx: newSongIdx,
        song: detachSong(),
      };
    }

    function detachSong(): NewSong {
      return {
        bpm: appState.song.bpm,
        title: "",
        timeSignatureBeats: appState.song.timeSignatureBeats,
        timeSignatureNoteValue: appState.song.timeSignatureNoteValue,
        subDivisions: appState.song.subDivisions,
        accents: [...appState.song.accents],
      };
    }
  }

  function withSongIdx(songIdx: number): AppState {
    return {
      ...appState,
      songIdx,
      song: getActiveSong(appState.setlist, songIdx),
    };
  }

  function withPreviousSong(): AppState {
    if (appState.setlist && appState.songIdx !== undefined) {
      const newIdx = appState.songIdx - 1;
      if (newIdx >= 0) {
        return withSongIdx(newIdx);
      }
    }
    return appState;
  }

  function withNextSong(): AppState {
    if (appState.setlist && appState.songIdx !== undefined) {
      const newIdx = appState.songIdx + 1;
      if (newIdx < appState.setlist.songIds.length) {
        return withSongIdx(newIdx);
      }
    }
    return appState;
  }

  function getActiveSong(
    setlist: SetlistWithSongs | undefined,
    activeSetlistIdx: number,
  ) {
    if (setlist && setlist.songs.length > activeSetlistIdx) {
      return setlist.songs[activeSetlistIdx];
    } else {
      return defaultSong;
    }
  }
}

export type MutableAppState = Required<Pick<AppState, "songIdx">> &
  Omit<AppState, "songIdx"> & {
    setBpm: (bpm: number) => void;
    nextSong: () => void;
    previousSong: () => void;
  };

export const AppStateContext = createContext<AppState | null>(null);
export const AppStateDispatchContext = createContext<Dispatch<Action> | null>(null);

export type AppStateContextProviderProps = PropsWithChildren<{
  initialAppState?: AppState;
}>;

export function AppStateContextProvider({
  children,
  initialAppState,
}: AppStateContextProviderProps) {
  const [appState, appStateDispatch] = useReducer(
    savingAppStateReducer,
    initialAppState ?? defaultAppState,
  );

  return (
    <AppStateContext.Provider value={appState}>
      <AppStateDispatchContext.Provider value={appStateDispatch}>
        {children}
      </AppStateDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}
