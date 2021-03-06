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
        let bpm = props.ctx.config.centerBpm + rotation * props.ctx.config.rotationFactor;
        bpm = Math.max(props.ctx.config.minBpm, bpm);
        bpm = Math.round(bpm);
        return bpm;
    }

    function bpmToRotation(bpm) {
        return (bpm - props.ctx.config.centerBpm) / props.ctx.config.rotationFactor;
    }

    return (
        <div>
            <BeatBar
                timeSignatureBeats={props.ctx.settings.timeSignatureBeats}
                accentBeatIndices={props.ctx.settings.accentBeatIndices}
                activeBeatIdx={props.ctx.state.activeBeatIdx}/>
            <div id="song-settings">
                <Button onClick={props.onTimeSignatureClick}>
                    {props.ctx.settings.timeSignatureBeats}
                    /
                    {props.ctx.settings.timeSignatureNoteValue}
                </Button>
                <Button id="button-subdivisions"><QuarterNoteSvg/></Button>
                <Button id="button-song-length"><FontAwesomeIcon icon={faClock}/></Button>
            </div>
            <div id="current-bpm-wrapper">
                <div id="current-bpm-label">
                    {getLabels(props.ctx.settings.bpm).join(", ")}
                </div>
                <div id="current-bpm">
                    {props.ctx.settings.bpm} BPM
                </div>
            </div>
            <div id="main-controls">
                <PlayButton
                    started={props.ctx.state.started}
                    onPlay={props.onPlay} />
                <SpeedKnob
                    rotation={bpmToRotation(props.ctx.settings.bpm)}
                    minRotation={bpmToRotation(props.ctx.config.minBpm)}
                    maxRotation={bpmToRotation(props.ctx.config.maxBpm)}
                    onRotate={speedKnobRotate}/>
                <Button>Tap</Button>
            </div>
        </div>
    );
}

export default Metronome;
