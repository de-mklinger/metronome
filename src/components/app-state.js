import {defaultSong} from "../lib/env";
import {useReducer} from "react";

const initialAppState = {
    song: defaultSong,
    setlist: null,
    activeSetlistIdx: 0
}

const appStateReducer = (appState, action) => {
    console.log("app state action:", action);

    function getActiveSong(setlist, activeSetlistIdx) {
        if (setlist && setlist.songs.length > activeSetlistIdx) {
            return setlist.songs[activeSetlistIdx];
        } else {
            return defaultSong;
        }
    }

    function extend(src, ext) {
        return Object.assign({}, src, ext);
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
            const currentSong = extend(appState.song, {id: null, title: null});
            return extend(appState, {
                setlist: null,
                activeSetlistIdx: newActiveSetlistIdx,
                song: currentSong
            });
        }
    }

    function withActiveSetlistIdx(activeSetlistIdx) {
        return extend(appState, {
            activeSetlistIdx: action.payload,
            song: getActiveSong(appState.setlist, activeSetlistIdx)
        });
    }

    switch (action.type) {
        case 'setSong':
            return withSong(action.payload);
        case 'setBpm':
            return withBpm(action.payload);
        case 'setSetlist':
            return withSetlist(action.payload);
        case 'setActiveSetlistIdx':
            return withActiveSetlistIdx(action.payload);
        default:
            throw new Error();
    }
}

const useAppState = () => useReducer(appStateReducer, initialAppState);

export default useAppState;