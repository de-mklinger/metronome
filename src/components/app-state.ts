import {defaultAppState, defaultSong} from "../lib/env.js";
import repository from "../lib/repository";
import React, {useReducer} from "react";
import {AppState, Config, NewSong, SetlistWithSongs, Song} from "../types.ts";

const useAppState = () => useReducer(savingAppStateReducer, defaultAppState);
export default useAppState;

function savingAppStateReducer(appState: AppState, action: Action) {
    // TODO only store non-default config values

    const newAppState = appStateReducer(appState, action);
    if (newAppState) {
        //console.log("New app state", newAppState);
        if (appState) {
            repository.saveAppState(newAppState)
                .then(() => {
                    //console.log("App state saved.")
                });
        } else {
            console.log("Not saving app state after initial set");
        }
        return newAppState;
    } else {
        console.warn("Reducer returned no app state on action", action);
        return appState;
    }
}

export type Action = { type: "setAppState", payload: AppState }
    | { type: "setConfig", payload: Config }
    | { type: 'setSong', payload: Song | NewSong }
    | { type: 'setBpm', payload: number }
    | { type: 'setSetlist', payload: SetlistWithSongs | undefined }
    | { type: 'nextSong' }
    | { type: 'previousSong' }
    | { type: 'setActiveSetlistIdx', payload: number }

export type AppStateDispatch = React.Dispatch<Action>;

export type AppStateProps<T = {}> = T & {
    appState: AppState
    appStateDispatch: AppStateDispatch
}

function appStateReducer(appState: AppState, action: Action): AppState {
    //console.log("app state action:", action);

    switch (action.type) {
        case "setAppState":
            return {...action.payload};
        case "setConfig":
            return withConfig(action.payload);
        case 'setSong':
            return withSong(action.payload);
        case 'setBpm':
            return withBpm(action.payload);
        case 'setSetlist':
            return withSetlist(action.payload);
        case 'nextSong':
            return withNextSong();
        case 'previousSong':
            return withPreviousSong();
        case 'setActiveSetlistIdx':
            return withActiveSetlistIdx(action.payload);
        default:
            // @ts-ignore
            throw new Error("Unsupported action type:" + action.type);
    }

    function withConfig(newConfig: Config) {
        return {
            ...appState,
            config: newConfig
        };
    }

    function withSong(newSong: Song | NewSong) {
        return {
            ...appState,
            song: newSong
        };
    }

    function withBpm(bpm: number) {
        if (bpm === appState.song.bpm) {
            return appState;
        }
        let newSong = {
            ...appState.song,
            bpm: bpm
        };
        return withSong(newSong);
    }

    function withSetlist(newSetlist: SetlistWithSongs | undefined): AppState {
        let newActiveSetlistIdx = 0;
        if (newSetlist) {
            // keep activeSetlistIdx if same setlist and idx is ok
            if (appState.setlist && appState.setlist.id === newSetlist.id && appState.setlist.songIds.length > appState.activeSetlistIdx) {
                newActiveSetlistIdx = appState.activeSetlistIdx;
            }
            return {
                ...appState,
                setlist: newSetlist,
                activeSetlistIdx: newActiveSetlistIdx,
                song: getActiveSong(newSetlist, newActiveSetlistIdx)
            };
        } else {
            // detach song:
            return {
                ...appState,
                setlist: undefined,
                activeSetlistIdx: newActiveSetlistIdx,
                song: detachSong()
            };
        }

        function detachSong(): NewSong {
            return {
                bpm: appState.song.bpm,
                title: "",
                timeSignatureBeats: appState.song.timeSignatureBeats,
                timeSignatureNoteValue: appState.song.timeSignatureNoteValue,
                subDivisions: appState.song.subDivisions,
                songLength: appState.song.songLength,
                accents: [...appState.song.accents],
            };
        }
    }

    function withActiveSetlistIdx(activeSetlistIdx: number) {
        return {
            ...appState,
            activeSetlistIdx: activeSetlistIdx,
            song: getActiveSong(appState.setlist, activeSetlistIdx)
        };
    }

    function withPreviousSong() {
        if (appState.setlist) {
            const newIdx = appState.activeSetlistIdx - 1;
            if (newIdx >= 0) {
                return withActiveSetlistIdx(newIdx);
            }
        }
        return appState;
    }

    function withNextSong() {
        if (appState.setlist) {
            const newIdx = appState.activeSetlistIdx + 1;
            if (newIdx < appState.setlist.songIds.length) {
                return withActiveSetlistIdx(newIdx);
            }
        }
        return appState;
    }

    function getActiveSong(setlist: SetlistWithSongs | undefined, activeSetlistIdx: number) {
        if (setlist && setlist.songs.length > activeSetlistIdx) {
            return setlist.songs[activeSetlistIdx];
        } else {
            return defaultSong;
        }
    }
}
