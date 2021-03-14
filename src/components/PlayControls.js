import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";
import PlayButton from "./PlayButton";
import {getLabels} from "../tempo";
import SpeedKnob from "./SpeedKnob";

function PlayControls({state, settings, config, onBpmChange, onPlay}) {

    const speedKnobRotate = (rotation) => {
        if (onBpmChange) {
            let bpm = rotationToBpm(rotation);
            //let rotationRev = bpmToRotation(bpm);
            //console.log(rotation, "->", bpm, "->", rotationRev);
            onBpmChange(bpm);
        }
    };

    const rotationToBpm = (rotation) => {
        let bpm = config.defaultBpm + rotation * config.rotationFactor;
        bpm = Math.max(config.minBpm, bpm);
        bpm = Math.round(bpm);
        return bpm;
    };

    const bpmToRotation = (bpm) => {
        return (bpm - config.defaultBpm) / config.rotationFactor;
    };

    const onPreviousClick = () => {
        if (settings.setlist) {
            // TODO
        }
    }

    return (
        <div id="play-controls">
            <div>
                <Button onClick={onPreviousClick}>
                    <FontAwesomeIcon icon={faStepBackward}/>
                </Button>
                <PlayButton
                    started={state.started}
                    onPlay={onPlay} />
            </div>
            <div className="speed">
                <div id="current-bpm-label">
                    {getLabels(settings.bpm).join(", ")}
                </div>
                <div id="current-bpm">
                    {settings.bpm} BPM
                </div>

                <SpeedKnob
                    key={settings.activeSetlistIdx} // Force applying rotation if new song was selected. Does not work when selecting song, changing bpm and selecting same song again :(
                    rotation={bpmToRotation(settings.bpm)}
                    minRotation={bpmToRotation(config.minBpm)}
                    maxRotation={bpmToRotation(config.maxBpm)}
                    onRotate={speedKnobRotate}/>
            </div>
            <div>
                <Button>
                    <FontAwesomeIcon icon={faStepForward}/>
                </Button>
                <Button>Tap</Button>
            </div>
        </div>
    );
}

export default PlayControls;