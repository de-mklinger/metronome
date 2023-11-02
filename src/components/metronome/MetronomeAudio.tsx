import React, {memo, MutableRefObject, RefObject, useCallback, useRef} from "react";
import {ctx} from "../../index.testFixtures.js";
import {earlyPlayThresholdMillis, missMillisThreshold} from "../../lib/env.js";
import {getTime, playSample} from "../../lib/audio.js";
import {NewSong, Song} from "../../types.ts";

const useAnimationFrame = (callback: () => void) => {
    const requestRef = React.useRef<number>();

    React.useEffect(() => {
        const animate = () => {
            callback();
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                //console.log("Cancelled animation frame");
                requestRef.current = undefined;
            }
        };
    }, [callback]); // Make sure the effect runs only once
}

const tick = (tickCtx: RefObject<TickCtx>, switchTime: MutableRefObject<number>, activeBeatIdx: MutableRefObject<number>) => {
    if (!tickCtx.current?.started) {
        //console.log("Not started!!");
        return;
    }

    const switchEveryMillis = 60 * 1000 / tickCtx.current.bpm;

    let now = new Date().getTime();
    let sinceLastSwitchMillis;
    if (activeBeatIdx.current === -1) {
        sinceLastSwitchMillis = switchEveryMillis;
    } else {
        sinceLastSwitchMillis = now - switchTime.current
    }

    let diff = sinceLastSwitchMillis - switchEveryMillis;

    if (diff >= earlyPlayThresholdMillis) {
        let missMillis = sinceLastSwitchMillis - switchEveryMillis;
        let whenOffsetSeconds = Math.max(0, -missMillis / 1000);
        let playTime = getTime(whenOffsetSeconds);

        activeBeatIdx.current++;
        if (activeBeatIdx.current >= tickCtx.current.timeSignatureBeats) {
            activeBeatIdx.current = 0;
        }

        //console.log('activeBeatIdx', ctx.state.activeBeatIdx, 'missMillis', missMillis, 'whenOffsetSeconds', whenOffsetSeconds);

        let currentAccent = tickCtx.current.accents[activeBeatIdx.current] || 1;
        switch (currentAccent) {
            case 2:
            case 3:
                if (!ctx.audio.accentAudioBuffer) {
                    throw new Error("Audio buffer not initialized");
                }
                // TODO more than one accent sound
                // console.log("Play accent", whenOffsetSeconds);
                playSample(ctx.audio.accentAudioBuffer, playTime);
                break;
            default:
                if (!ctx.audio.nonAccentAudioBuffer) {
                    throw new Error("Audio buffer not initialized");
                }
                // console.log("Play non-accent", whenOffsetSeconds);
                playSample(ctx.audio.nonAccentAudioBuffer, playTime);
                break;
        }

        if (missMillis > missMillisThreshold) {
            // Gap is too large. Maybe we have been suspended in the meantime?
            switchTime.current = now;
        } else {
            switchTime.current = now - missMillis;
        }

        if (missMillis < -16 || missMillis > 0) {
            console.log("miss millis", missMillis);
        }

        tickCtx.current.onActiveBeatIdxChange(activeBeatIdx.current);
    }
};

export type MetronomeAudioProps = {
    started: boolean,
    song: Song | NewSong,
    onActiveBeatIdxChange: (activeBeatIdx: number) => void
}

type TickCtx = {
    started: boolean,
    bpm: number,
    timeSignatureBeats: number,
    accents: number[],
    onActiveBeatIdxChange: (activeBeatIdx: number) => void
}

function WrappedMetronomeAudio({started, song, onActiveBeatIdxChange}: MetronomeAudioProps) {
    //console.log("WrappedMetronomeAudio render");

    const current: TickCtx = {
        started: started,
        bpm: song.bpm,
        timeSignatureBeats: song.timeSignatureBeats,
        accents: song.accents,
        onActiveBeatIdxChange: onActiveBeatIdxChange
    }

    const tickCtx = useRef(current);

    tickCtx.current = current;

    const switchTime = useRef(0);
    const activeBeatIdx = useRef(-1);
    if (!started) {
        activeBeatIdx.current = -1;
    }

    const tickCallback = useCallback(() => tick(tickCtx, switchTime, activeBeatIdx), []);

    useAnimationFrame(tickCallback);

    return null;
}

const MetronomeAudio = memo(WrappedMetronomeAudio);

export default MetronomeAudio;
