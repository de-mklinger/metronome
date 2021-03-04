import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {getAudioBuffer, playSample, playSilence} from './audio'
import Cowbell1 from './sounds/Cowbell-1.wav'
import Cowbell2 from './sounds/Cowbell-2.wav'


let ctx = {
    // user settings
    bpm: 120,
    numberOfBeats: 4,
    accentBeatIndices: [0],
    centerBpm: 120, // ui

    // reasonable base settings
    rotationFactor: 0.05, // wheel-ux. Multiplied with 0°-360°
    earlyPlayThresholdMillis: -18, // animation frame dependent. Assuming 60 FPS, actually 16.6666.
    minBpm: 1, // const. Can we go back in time, or stay forever?
    maxBpm: 400,
    playSilenceIntervalMillis: 10000,
    missMillisThreshold: 100,

    // internal state
    state: {
        started: false,
        activeBeatIdx: -1,
        switchTime: 0,
    },

    metrics: {
        lastStartTime: 0
    },
}

function render() {
    ReactDOM.render(
        <React.StrictMode>
            <App ctx={ctx} onPlay={play} onBpmChange={bpmChange}/>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

async function setUp() {
    ctx.accentAudioBuffer = await getAudioBuffer(Cowbell2);
    ctx.nonAccentAudioBuffer = await getAudioBuffer(Cowbell1);

    if (ctx.playSilenceIntervalMillis > 0) {
        ctx.playSilenceTimeout = setInterval(() => {
            //console.log("Play silence");
            playSilence();
        }, ctx.playSilenceIntervalMillis);
    }

    return ctx;
}

function play() {
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

    const switchEveryMillis = 60 * 1000 / ctx.bpm

    let now = new Date().getTime();
    let sinceLastSwitchMillis;
    if (ctx.state.activeBeatIdx === -1) {
        sinceLastSwitchMillis = switchEveryMillis;
    } else {
        sinceLastSwitchMillis = now - ctx.state.switchTime
    }
    let diff = sinceLastSwitchMillis - switchEveryMillis;
    if (diff >= ctx.earlyPlayThresholdMillis) {
        ctx.state.activeBeatIdx++;
        if (ctx.state.activeBeatIdx >= ctx.numberOfBeats) {
            ctx.state.activeBeatIdx = 0;
        }

        let missMillis = sinceLastSwitchMillis - switchEveryMillis;
        let whenOffsetSeconds = Math.max(0, -missMillis / 1000);
        console.log('activeBeatIdx', ctx.state.activeBeatIdx, 'missMillis', missMillis, 'whenOffsetSeconds', whenOffsetSeconds);

        if (ctx.accentBeatIndices.indexOf(ctx.state.activeBeatIdx) !== -1) {
            playSample(ctx.accentAudioBuffer, whenOffsetSeconds);
        } else {
            playSample(ctx.nonAccentAudioBuffer, whenOffsetSeconds);
        }

        if (missMillis > ctx.missMillisThreshold) {
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

function bpmChange(bpm) {
    if (bpm !== ctx.bpm) {
        //console.log("BPM:", bpm);
        ctx.bpm = bpm;
        render();
    }
}

render();
setUp()
    .then(x => console.log("Setup done", x))
    .then(render)
    .catch(x => console.log("Error", x));
