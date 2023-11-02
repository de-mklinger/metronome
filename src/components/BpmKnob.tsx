import {defaultBpm, maxBpm, minBpm, rotationFactor} from "../lib/env.js";
import Knob from "./Knob.js";
import {useRef} from "react";

const rotationToBpm = (rotation: number) => {
    let bpm = defaultBpm + rotation * rotationFactor;
    bpm = Math.max(minBpm, bpm);
    bpm = Math.round(bpm);
    return bpm;
};

const bpmToRotation = (bpm: number) => {
    return (bpm - defaultBpm) / rotationFactor;
};

export type BpmKnobProps = {
    bpm: number,
    onBpmChange: (bpm: number) => void
}

function BpmKnob({bpm, onBpmChange}: BpmKnobProps) {
    // Work around the fact that Knob must move smooth while rotating
    // and still react to changes from outside.
    //
    // Store the last Knob-produced bpm value and only trigger
    // re-initialize via key when value is changed from outside.

    const lastKnobBpm = useRef(bpm);
    const key = useRef(Math.random());

    const handleRotate = (rotation: number) => {
        const bpm = rotationToBpm(rotation);
        lastKnobBpm.current = bpm;
        onBpmChange(bpm);
    }

    if (lastKnobBpm.current !== bpm) {
        // change from outside
        //console.log("change from outside");
        lastKnobBpm.current = bpm;
        key.current = Math.random();
    }

    return <Knob
        key={key.current}
        rotation={bpmToRotation(bpm)}
        minRotation={bpmToRotation(minBpm)}
        maxRotation={bpmToRotation(maxBpm)}
        onRotate={handleRotate}
    />
}

export default BpmKnob;
