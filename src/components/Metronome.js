import BeatBar from './BeatBar';
import SongControls from "./SongControls";
import PlayControls from "./PlayControls";

function Metronome(props) {
    return (
        <div className="metronome">
            <BeatBar
                timeSignatureBeats={props.ctx.settings.timeSignatureBeats}
                accentBeatIndices={props.ctx.settings.accentBeatIndices}
                activeBeatIdx={props.ctx.state.activeBeatIdx} />
            <SongControls
                settings={props.ctx.settings}
                onTimeSignatureClick={props.onTimeSignatureClick}
                onSongSelect={props.onSongSelect}
                onSetlistDeselect={props.onSetlistDeselect}
                onSetlistButtonClick={props.onSetlistButtonClick} />
            <PlayControls
                state={props.ctx.state}
                settings={props.ctx.settings}
                config={props.ctx.config}
                onBpmChange={props.onBpmChange}
                onPlay={props.onPlay}
                onSongSelect={props.onSongSelect} />
        </div>
    );
}

export default Metronome;
