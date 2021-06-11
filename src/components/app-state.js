import {defaultSong} from "../lib/env";
import {useReducer} from "react";
import songRepository from "../lib/songRepository";

const defaultAppState = {
    song: defaultSong,
    setlist: null,
    activeSetlistIdx: 0
}
export {defaultAppState};

const useAppState = () => useReducer(savingAppStateReducer, null);
export default useAppState;

const extend = (src, ext) => Object.assign({}, src, ext)

function savingAppStateReducer(appState, action) {
    const newAppState = appStateReducer(appState, action);
    console.log("Store app state: ", newAppState);
    songRepository.saveAppState(newAppState)
        .then(() => console.log("App state saved."));
    return newAppState;
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
            activeSetlistIdx: action.payload,
            song: getActiveSong(appState.setlist, activeSetlistIdx)
        });
    }

    function getActiveSong(setlist, activeSetlistIdx) {
        if (setlist && setlist.songs.length > activeSetlistIdx) {
            return setlist.songs[activeSetlistIdx];
        } else {
            return defaultSong;
        }
    }
}
