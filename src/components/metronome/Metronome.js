import BeatBar from './BeatBar';
import SongControls from "./SongControls";
import PlayControls from "./PlayControls";
import MetronomeAudio from "./MetronomeAudio";
import {useState} from "react";

function Metronome(props) {
    const [started, setStarted] = useState(false);
    const [activeBeatIdx, setActiveBeatIdx] = useState(-1);

    return (
        <div className="metronome">
            <MetronomeAudio
                started={started}
                bpm={props.ctx.settings.bpm}
                timeSignatureBeats={props.ctx.settings.timeSignatureBeats}
                accents={[2, 1]} // TODO
                onActiveBeatIdxChange={setActiveBeatIdx}
            />

            <BeatBar
                timeSignatureBeats={props.ctx.settings.timeSignatureBeats}
                accentBeatIndices={props.ctx.settings.accentBeatIndices}
                activeBeatIdx={activeBeatIdx}
            />

            <SongControls
                setlistId={props.ctx.settings.setlistId}
                activeSetlistIdx={props.ctx.settings.activeSetlistIdx}
                timeSignatureBeats={props.ctx.settings.timeSignatureBeats}
                timeSignatureNoteValue={props.ctx.settings.timeSignatureNoteValue}
                onSongSelect={props.onSongSelect}
                onSetlistDeselect={props.onSetlistDeselect}
                onSetlistButtonClick={props.onSetlistButtonClick}
                onTimeSignatureClick={props.onTimeSignatureClick}
            />

            <PlayControls
                started={props.ctx.state.started}
                setlistId={props.ctx.settings.setlistId}
                activeSetlistIdx={props.ctx.settings.activeSetlistIdx}
                bpm={props.ctx.settings.bpm}
                onBpmChange={props.onBpmChange}
                onPlay={() => setStarted(!started)}
                onSongSelect={props.onSongSelect}
            />
        </div>
    );
}

export default Metronome;
