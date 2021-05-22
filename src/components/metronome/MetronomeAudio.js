import React, {useCallback, useRef} from "react";
import {ctx} from "../../index.testFixtures";
import {earlyPlayThresholdMillis, missMillisThreshold} from "../../lib/env";
import {playSample} from "../../lib/audio";

const useAnimationFrame = (callback) => {
    const requestRef = React.useRef();

    React.useEffect(() => {
        const animate = () => {
            callback();
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(requestRef.current);
            console.log("Cancelled animation frame");
        };
    }, [callback]); // Make sure the effect runs only once
}

const tick = (tickCtx, switchTime, activeBeatIdx) => {
    if (!tickCtx.current.started) {
        //console.log("Not started!!");
        return;
    }

    const switchEveryMillis = 60 * 1000 / tickCtx.current.bpm;

    let now = new Date().getTime();
    let sinceLastSwitchMillis;
    if (tickCtx.current.activeBeatIdx === -1) {
        sinceLastSwitchMillis = switchEveryMillis;
    } else {
        sinceLastSwitchMillis = now - switchTime.current
    }
    let diff = sinceLastSwitchMillis - switchEveryMillis;
    if (diff >= earlyPlayThresholdMillis) {
        activeBeatIdx.current++;
        if (activeBeatIdx.current >= tickCtx.current.timeSignatureBeats) {
            activeBeatIdx.current = 0;
        }

        let missMillis = sinceLastSwitchMillis - switchEveryMillis;
        let whenOffsetSeconds = Math.max(0, -missMillis / 1000);
        //console.log('activeBeatIdx', ctx.state.activeBeatIdx, 'missMillis', missMillis, 'whenOffsetSeconds', whenOffsetSeconds);

        let currentAccent = tickCtx.current.accents[activeBeatIdx.current] || 1;
        switch (currentAccent) {
            case 2:
            case 3:
                // TODO more than one accent sound
                // console.log("Play accent", whenOffsetSeconds);
                playSample(ctx.audio.accentAudioBuffer, whenOffsetSeconds);
                break;
            default:
                // console.log("Play non-accent", whenOffsetSeconds);
                playSample(ctx.audio.nonAccentAudioBuffer, whenOffsetSeconds);
                break;
        }

        if (missMillis > missMillisThreshold) {
            // Gap is too large. Maybe we have been suspended in the meantime?
            switchTime.current = now;
        } else {
            switchTime.current = now - missMillis;
        }

        tickCtx.current.onActiveBeatIdxChange(activeBeatIdx.current);
    }
};

function MetronomeAudio({started, bpm, timeSignatureBeats, accents, onActiveBeatIdxChange}) {
    const tickCtx = useRef({});
    tickCtx.current = {
        started: started,
        bpm: bpm,
        timeSignatureBeats: timeSignatureBeats,
        accents: accents,
        onActiveBeatIdxChange: onActiveBeatIdxChange
    }

    const switchTime = useRef(0);
    const activeBeatIdx = useRef(-1);
    if (!started) {
        activeBeatIdx.current = -1;
    }

    const tickCallback = useCallback(() => tick(tickCtx, switchTime, activeBeatIdx), []);

    useAnimationFrame(tickCallback);

    return null;
}

export default MetronomeAudio;