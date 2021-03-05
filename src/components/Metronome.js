import {getLabels} from "../tempo";

import BeatBar from './BeatBar';
import SpeedKnob from './SpeedKnob';
import PlayButton from "./PlayButton";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from '@fortawesome/free-regular-svg-icons'
import {ReactComponent as QuarterNoteSvg} from "../images/quarter-note.svg"
import Button from 'react-bootstrap/Button';

function Metronome(props) {
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
                timeSignatureBeats={props.ctx.timeSignatureBeats}
                accentBeatIndices={props.ctx.accentBeatIndices}
                activeBeatIdx={props.ctx.state.activeBeatIdx}/>
            <div id="song-settings">
                <Button onClick={props.onTimeSignatureClick}>
                    {props.ctx.timeSignatureBeats}
                    /
                    {props.ctx.timeSignatureNoteValue}
                </Button>
                <Button id="button-subdivisions"><QuarterNoteSvg/></Button>
                <Button id="button-song-length"><FontAwesomeIcon icon={faClock}/></Button>
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
                <PlayButton
                    started={props.ctx.state.started}
                    onPlay={props.onPlay} />
                <SpeedKnob
                    rotation={bpmToRotation(props.ctx.bpm)}
                    minRotation={bpmToRotation(props.ctx.minBpm)}
                    maxRotation={bpmToRotation(props.ctx.maxBpm)}
                    onRotate={speedKnobRotate}/>
                <Button>Tap</Button>
            </div>
        </div>
    );
}

export default Metronome;
