import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlay} from '@fortawesome/free-solid-svg-icons'
import './BeatBar';
import './SpeedKnob';
import BeatBar from "./BeatBar";
import {getLabels} from "./tempo";
import SpeedKnob from "./SpeedKnob";

function App(props) {
    function speedKnobRotate(rotation) {
        if (props.onBpmChange) {
            let bpm = rotationToBpm(rotation);
            //let rotationRev = bpmToRotation(bpm);
            //console.log(rotation, "->", bpm, "->", rotationRev);
            props.onBpmChange(bpm);
        }
    }

    function rotationToBpm(rotation) {
        let bpm = props.ctx.centerBpm + rotation * props.ctx.rotationFactor;
        bpm = Math.max(props.ctx.minBpm, bpm);
        bpm = Math.round(bpm);
        return bpm;
    }

    function bpmToRotation(bpm) {
        return (bpm - props.ctx.centerBpm) / props.ctx.rotationFactor;
    }

    return (
        <div>
            <BeatBar
                numberOfBeats={props.ctx.numberOfBeats}
                accentBeatIndices={props.ctx.accentBeatIndices}
                activeBeatIdx={props.ctx.state.activeBeatIdx}/>
            <div id="song-settings">
                <button id="button-time-signature">4/4</button>
                <button id="button-subdivisions">Q</button>
                <button id="button-song-length">L</button>
            </div>
            <div id="current-bpm-wrapper">
                <div id="current-bpm-label">
                    {getLabels(props.ctx.bpm).join(", ")}
                </div>
                <div id="current-bpm">
                    {props.ctx.bpm} BPM
                </div>
            </div>
            <div id="main-controls">
                <button id="button-play" onClick={props.onPlay}>
                    <FontAwesomeIcon icon={faPlay}/>
                </button>
                <SpeedKnob
                    rotation={bpmToRotation(props.ctx.bpm)}
                    onRotate={speedKnobRotate}/>
                <button id="button-tap">Tap</button>
            </div>
        </div>);
}

export default App;
