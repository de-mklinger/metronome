import React, {useRef} from "react";
import {ctx} from "../../index.testFixtures";
import {earlyPlayThresholdMillis, missMillisThreshold} from "../../lib/env";
import {playSample} from "../../audio";

const useAnimationFrame = (callback, started) => {
    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = React.useRef();
    const previousTimeRef = React.useRef();

    React.useEffect(() => {
        if (started) {
            const animate = time => {
                let deltaTime;
                if (previousTimeRef.current !== undefined) {
                    deltaTime = time - previousTimeRef.current;
                } else {
                    deltaTime = null;
                }
                callback(deltaTime)
                previousTimeRef.current = time;
                requestRef.current = requestAnimationFrame(animate);
            };

            requestRef.current = requestAnimationFrame(animate);
            return () => {
                console.log("Cancel animation frame");
                cancelAnimationFrame(requestRef.current);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [started]); // Make sure the effect runs only when started value changes, ignore changes on callback
}

function MetronomeAudio({started, bpm, timeSignatureBeats, accents, onActiveBeatIdxChange}) {
    const switchTime = useRef(0);
    const activeBeatIdx = useRef(-1);

    if (!started) {
        activeBeatIdx.current = -1;
    }

    const tick = () => {
        const switchEveryMillis = 60 * 1000 / bpm;

        let now = new Date().getTime();
        let sinceLastSwitchMillis;
        if (activeBeatIdx.current === -1) {
            sinceLastSwitchMillis = switchEveryMillis;
        } else {
            sinceLastSwitchMillis = now - switchTime.current
        }
        let diff = sinceLastSwitchMillis - switchEveryMillis;
        if (diff >= earlyPlayThresholdMillis) {
            activeBeatIdx.current++;
            if (activeBeatIdx.current >= timeSignatureBeats) {
                activeBeatIdx.current = 0;
            }

            let missMillis = sinceLastSwitchMillis - switchEveryMillis;
            let whenOffsetSeconds = Math.max(0, -missMillis / 1000);
            //console.log('activeBeatIdx', ctx.state.activeBeatIdx, 'missMillis', missMillis, 'whenOffsetSeconds', whenOffsetSeconds);

            let currentAccent = accents[activeBeatIdx.current] || 1;
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

            // showActive(ctx.state.activeBeatIdx);
            onActiveBeatIdxChange(activeBeatIdx.current);
        }
    };

    useAnimationFrame(tick, started);

    return <></>;
}

export default MetronomeAudio;