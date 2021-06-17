import BeatBar from './BeatBar';
import SongControls from "./SongControls";
import PlayControls from "./PlayControls";
import MetronomeAudio from "./MetronomeAudio";
import {useState} from "react";
import KeyListener from "./KeyListener";

function Metronome({appState, appStateDispatch}) {
    const [started, setStarted] = useState(false);
    const [activeBeatIdx, setActiveBeatIdx] = useState(-1);

    return (
        <div className="metronome">
            <MetronomeAudio
                started={started}
                song={appState.song}
                onActiveBeatIdxChange={setActiveBeatIdx}
            />

            <KeyListener
                onPlay={() => setStarted(!started)}
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
                onPlay={() => setStarted(!started)}
            />
        </div>
    );
}

export default Metronome;
