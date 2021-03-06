import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import './index.scss';
import App from './components/App';

import {getAudioBuffer, playSample, playSilence} from './audio'
import Cowbell1 from './sounds/Cowbell-1.wav'
import Cowbell2 from './sounds/Cowbell-2.wav'


let ctx = {
    // user settings
    settings: {
        bpm: 120,
        timeSignatureBeats: 4,
        timeSignatureNoteValue: 4,
        accentBeatIndices: [0]
    },

    // reasonable base settings
    config: {
        centerBpm: 120, // ui
        rotationFactor: 0.05, // wheel-ux. Multiplied with 0°-360°
        earlyPlayThresholdMillis: -18, // animation frame dependent. Assuming 60 FPS, actually 16.6666.
        minBpm: 1, // const. Can we go back in time, or stay forever?
        maxBpm: 400,
        playSilenceIntervalMillis: 10000,
        missMillisThreshold: 100,
    },

    // internal state
    state: {
        started: false,
        activeBeatIdx: -1,
        switchTime: 0,
    },

    metrics: {
        lastStartTime: 0
    },

    audio: {
    }
}

function render() {
    ReactDOM.render(
        <React.StrictMode>
            <App
                ctx={ctx}
                onPlay={handlePlay}
                onTimeSignatureBeatsChange={handleTimeSignatureBeatsChange}
                onTimeSignatureNoteValueChange={handleTimeSignatureNoteValueChange}
                onBpmChange={handleBpmChange}/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

async function setUp() {
    ctx.audio.accentAudioBuffer = await getAudioBuffer(Cowbell2);
    ctx.audio.nonAccentAudioBuffer = await getAudioBuffer(Cowbell1);

    if (ctx.config.playSilenceIntervalMillis > 0) {
        setInterval(() => {
            //console.log("Play silence");
            playSilence();
        }, ctx.config.playSilenceIntervalMillis);
    }

    return ctx;
}

function handlePlay() {
    console.log("Play");

    let doStart = !!!ctx.state.started;

    ctx.state.started = doStart;

    if (doStart) {
        let now = new Date().getTime();
        console.log("Start", "Last start time ", (now - ctx.metrics.lastStartTime) / 1000, "seconds ago");
        ctx.metrics.lastStartTime = now;
        requestAnimationFrame(tick);
    } else {
        console.log("Stop");
        // showActive(-1);
        ctx.state.activeBeatIdx = -1;
        render();
    }
}

function tick() {
    if (!ctx.state.started) {
        return;
    }

    const switchEveryMillis = 60 * 1000 / ctx.settings.bpm

    let now = new Date().getTime();
    let sinceLastSwitchMillis;
    if (ctx.state.activeBeatIdx === -1) {
        sinceLastSwitchMillis = switchEveryMillis;
    } else {
        sinceLastSwitchMillis = now - ctx.state.switchTime
    }
    let diff = sinceLastSwitchMillis - switchEveryMillis;
    if (diff >= ctx.config.earlyPlayThresholdMillis) {
        ctx.state.activeBeatIdx++;
        if (ctx.state.activeBeatIdx >= ctx.settings.timeSignatureBeats) {
            ctx.state.activeBeatIdx = 0;
        }

        let missMillis = sinceLastSwitchMillis - switchEveryMillis;
        let whenOffsetSeconds = Math.max(0, -missMillis / 1000);
        console.log('activeBeatIdx', ctx.state.activeBeatIdx, 'missMillis', missMillis, 'whenOffsetSeconds', whenOffsetSeconds);

        if (ctx.settings.accentBeatIndices.indexOf(ctx.state.activeBeatIdx) !== -1) {
            playSample(ctx.audio.accentAudioBuffer, whenOffsetSeconds);
        } else {
            playSample(ctx.audio.nonAccentAudioBuffer, whenOffsetSeconds);
        }

        if (missMillis > ctx.config.missMillisThreshold) {
            // Gap is too large. Maybe we have been suspended in the meantime?
            ctx.state.switchTime = now;
        } else {
            ctx.state.switchTime = now - missMillis;
        }

        // showActive(ctx.state.activeBeatIdx);
        render();
    }

    requestAnimationFrame(tick);
}

function handleBpmChange(bpm) {
    if (bpm !== ctx.settings.bpm) {
        //console.log("BPM:", bpm);
        ctx.settings.bpm = bpm;
        render();
    }
}

function handleTimeSignatureBeatsChange(timeSignatureBeats) {
    ctx.settings.timeSignatureBeats = timeSignatureBeats;
    render();
}

function handleTimeSignatureNoteValueChange(timeSignatureNoteValue) {
    ctx.settings.timeSignatureNoteValue = timeSignatureNoteValue;
    render();
}

render();
setUp()
    .then(x => console.log("Setup done", x))
    .then(render)
    .catch(x => console.log("Error", x));
