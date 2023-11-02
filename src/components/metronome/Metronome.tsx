import BeatBar from './BeatBar.js';
import SongControls from "./SongControls.tsx";
import PlayControls from "./PlayControls.tsx";
import MetronomeAudio from "./MetronomeAudio.tsx";
import {useCallback, useState} from "react";
import KeyListener from "./KeyListener.tsx";
import {useNoSleep} from "../../lib/no-sleep.js";
import {AppStateProps} from "../../lib/app-state.ts";

export type MetronomeProps = AppStateProps;

function Metronome({appState, appStateDispatch}: MetronomeProps) {
    const [started, setStarted] = useState(false);
    const onPlay = useCallback(() => {
        setStarted((started) => !started);
    }, []);

    const [activeBeatIdx, setActiveBeatIdx] = useState(-1);

    useNoSleep(appState.config.noSleepWhenStarted && started);

    return (
        <>
            {/*<NoSleepDebugView noSleep={noSleep} />*/}

            <MetronomeAudio
                started={started}
                song={appState.song}
                onActiveBeatIdxChange={setActiveBeatIdx}
            />

            <KeyListener
                onPlay={onPlay}
                appState={appState}
                appStateDispatch={appStateDispatch}
            />

            <BeatBar
                song={appState.song}
                activeBeatIdx={activeBeatIdx}
            />

            <SongControls
                appState={appState}
                appStateDispatch={appStateDispatch}
            />

            <PlayControls
                started={started}
                appState={appState}
                appStateDispatch={appStateDispatch}
                onPlay={onPlay}
            />
        </>
    );
}

export default Metronome;
