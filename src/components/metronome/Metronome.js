import BeatBar from './BeatBar';
import SongControls from "./SongControls";
import PlayControls from "./PlayControls";
import MetronomeAudio from "./MetronomeAudio";
import {useCallback, useState} from "react";
import KeyListener from "./KeyListener";
import Div100vh from "react-div-100vh";
import {useNoSleep} from "../../lib/no-sleep";

function Metronome({appState, appStateDispatch}) {
    const [started, setStarted] = useState(false);
    const onPlay = useCallback(() => {
        setStarted((started) => !started);
    }, []);

    const [activeBeatIdx, setActiveBeatIdx] = useState(-1);

    useNoSleep(appState.config.noSleepWhenStarted && started);

    return (
        <Div100vh className="metronome">
            {/*<NoSleepDebugView noSleep={noSleep} />*/}

            <MetronomeAudio
                started={started}
                song={appState.song}
                onActiveBeatIdxChange={setActiveBeatIdx}
            />

            <KeyListener
                onPlay={onPlay}
                config={appState.config}
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
        </Div100vh>
    );
}

export default Metronome;
