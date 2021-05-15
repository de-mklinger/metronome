import {defaultBpm, rotationFactor, minBpm, maxBpm} from "../lib/env";
import Knob from "./Knob";

const rotationToBpm = (rotation) => {
    let bpm = defaultBpm + rotation * rotationFactor;
    bpm = Math.max(minBpm, bpm);
    bpm = Math.round(bpm);
    return bpm;
};

const bpmToRotation = (bpm) => {
    return (bpm - defaultBpm) / rotationFactor;
};

function BpmKnob({bpm, onBpmChange}) {
    return <Knob
        rotation={bpmToRotation(bpm)}
        minRotation={bpmToRotation(minBpm)}
        maxRotation={bpmToRotation(maxBpm)}
        onRotate={rotation => onBpmChange(rotationToBpm(rotation))}
    />
}

export default BpmKnob;