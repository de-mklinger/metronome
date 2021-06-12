import {defaultSong} from "../lib/env";
import repository from "../lib/repository";
import {useReducer} from "react";

const useAppState = () => useReducer(savingAppStateReducer, null);
export default useAppState;

function savingAppStateReducer(appState, action) {
    const newAppState = appStateReducer(appState, action);
    if (newAppState) {
        repository.saveAppState(newAppState)
            .then(() => {
                //console.log("App state saved.")
            });
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

    function withSong(newSong) {
        return extend(appState, {song: newSong});
    }

    function withBpm(bpm) {
        if (bpm === appState.song.bpm) {
            return appState;
        }
        let newSong = extend(appState.song, {bpm: bpm});
        return withSong(newSong);
    }

    function withSetlist(newSetlist) {
        let newActiveSetlistIdx = 0;
        if (newSetlist) {
            // keep activeSetlistIdx if same setlist and idx is ok
            if (appState.setlist && appState.setlist.id === newSetlist.id && appState.setlist.songs.length > appState.activeSetlistIdx) {
                newActiveSetlistIdx = appState.activeSetlistIdx;
            }
            return extend(appState, {
                setlist: newSetlist,
                activeSetlistIdx: newActiveSetlistIdx,
                song: getActiveSong(newSetlist, newActiveSetlistIdx)
            });
        } else {
            // detach song:
            return extend(appState, {
                setlist: null,
                activeSetlistIdx: newActiveSetlistIdx,
                song: detachSong()
            });
        }

        function detachSong() {
            return extend(appState.song, {
                id: null,
                title: "",
                setlists: null,
                setlistIds: null
            });
        }
    }

    function withActiveSetlistIdx(activeSetlistIdx) {
        return extend(appState, {
            activeSetlistIdx: activeSetlistIdx,
            song: getActiveSong(appState.setlist, activeSetlistIdx)
        });
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

    // internal, TODO remove

    function extend(src, ext) {
        return Object.assign({}, src, ext);
    }

}
