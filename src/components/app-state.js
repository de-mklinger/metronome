import {defaultSong} from "../lib/env";
import repository from "../lib/repository";
import {useReducer} from "react";

const useAppState = () => useReducer(savingAppStateReducer, null);
export default useAppState;

function savingAppStateReducer(appState, action) {
    // TODO only store non-default config values

    const newAppState = appStateReducer(appState, action);
    if (newAppState) {
        if (appState) {
            //console.log("New app state", newAppState);
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

function appStateReducer(appState, action) {
    //console.log("app state action:", action);

    switch (action.type) {
        case "setAppState":
            return action.payload;
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
            throw new Error("Unsupported action type:" + action.type);
    }

    function withConfig(newConfig) {
        return {
            ...appState,
            config: newConfig
        };
    }

    function withSong(newSong) {
        return {
            ...appState,
            song: newSong
        };
    }

    function withBpm(bpm) {
        if (bpm === appState.song.bpm) {
            return appState;
        }
        let newSong = {
            ...appState.song,
            bpm: bpm
        };
        return withSong(newSong);
    }

    function withSetlist(newSetlist) {
        let newActiveSetlistIdx = 0;
        if (newSetlist) {
            // keep activeSetlistIdx if same setlist and idx is ok
            if (appState.setlist && appState.setlist.id === newSetlist.id && appState.setlist.songs.length > appState.activeSetlistIdx) {
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
                setlist: null,
                activeSetlistIdx: newActiveSetlistIdx,
                song: detachSong()
            };
        }

        function detachSong() {
            return {
                ...appState.song,
                id: null,
                title: "",
                setlists: null,
                setlistIds: null
            };
        }
    }

    function withActiveSetlistIdx(activeSetlistIdx) {
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

    function getActiveSong(setlist, activeSetlistIdx) {
        if (setlist && setlist.songs.length > activeSetlistIdx) {
            return setlist.songs[activeSetlistIdx];
        } else {
            return defaultSong;
        }
    }
}
