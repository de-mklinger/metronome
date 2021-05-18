import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import './styles/index.scss';
import App from './components/App';

import songRepository from "./lib/songRepository";
import {ctx} from './index.testFixtures'
import {getAudioBuffer, playSilence} from './audio'
import Cowbell1 from './sounds/Cowbell-1.wav'
import Cowbell2 from './sounds/Cowbell-2.wav'
import {defaultBpm, playSilenceIntervalMillis} from "./lib/env";

function render() {
    ReactDOM.render(
        <React.StrictMode>
            <App
                ctx={ctx}
                // onPlay={handlePlay}
                onTimeSignatureBeatsChange={handleTimeSignatureBeatsChange}
                onTimeSignatureNoteValueChange={handleTimeSignatureNoteValueChange}
                onBpmChange={handleBpmChange}
                onSongSelect={handleSongSelect}
                onSetlistSelect={handleSetlistSelect}
            />
        </React.StrictMode>,
        document.getElementById('root')
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function initBpm() {
    if (ctx.settings.setlistId !== null) {
        return songRepository.getSetlist(ctx.settings.setlistId)
            .then(setlist => {
                const activeSong = setlist.songs[ctx.settings.activeSetlistIdx];
                ctx.settings.bpm = activeSong.bpm;
            });
    } else {
        ctx.settings.bpm = defaultBpm;
        return Promise.resolve()
    }
}

async function setUp() {
    ctx.audio.accentAudioBuffer = await getAudioBuffer(Cowbell2);
    ctx.audio.nonAccentAudioBuffer = await getAudioBuffer(Cowbell1);

    if (playSilenceIntervalMillis > 0) {
        setInterval(() => {
            //console.log("Play silence");
            playSilence();
        }, playSilenceIntervalMillis);
    }

    return ctx;
}

// function handlePlay() {
//     console.log("Play");
//
//     let doStart = !!!ctx.state.started;
//
//     ctx.state.started = doStart;
//
//     if (doStart) {
//         let now = new Date().getTime();
//         console.log("Start", "Last start time ", (now - ctx.metrics.lastStartTime) / 1000, "seconds ago");
//         ctx.metrics.lastStartTime = now;
//         requestAnimationFrame(tick);
//     } else {
//         console.log("Stop");
//         // showActive(-1);
//         ctx.state.activeBeatIdx = -1;
//         render();
//     }
// }

// function tick() {
//     if (!ctx.state.started) {
//         return;
//     }
//
//     const switchEveryMillis = 60 * 1000 / ctx.settings.bpm
//
//     let now = new Date().getTime();
//     let sinceLastSwitchMillis;
//     if (ctx.state.activeBeatIdx === -1) {
//         sinceLastSwitchMillis = switchEveryMillis;
//     } else {
//         sinceLastSwitchMillis = now - ctx.state.switchTime
//     }
//     let diff = sinceLastSwitchMillis - switchEveryMillis;
//     if (diff >= earlyPlayThresholdMillis) {
//         ctx.state.activeBeatIdx++;
//         if (ctx.state.activeBeatIdx >= ctx.settings.timeSignatureBeats) {
//             ctx.state.activeBeatIdx = 0;
//         }
//
//         let missMillis = sinceLastSwitchMillis - switchEveryMillis;
//         let whenOffsetSeconds = Math.max(0, -missMillis / 1000);
//         //console.log('activeBeatIdx', ctx.state.activeBeatIdx, 'missMillis', missMillis, 'whenOffsetSeconds', whenOffsetSeconds);
//
//         if (ctx.settings.accentBeatIndices.indexOf(ctx.state.activeBeatIdx) !== -1) {
//             playSample(ctx.audio.accentAudioBuffer, whenOffsetSeconds);
//         } else {
//             playSample(ctx.audio.nonAccentAudioBuffer, whenOffsetSeconds);
//         }
//
//         if (missMillis > missMillisThreshold) {
//             // Gap is too large. Maybe we have been suspended in the meantime?
//             ctx.state.switchTime = now;
//         } else {
//             ctx.state.switchTime = now - missMillis;
//         }
//
//         // showActive(ctx.state.activeBeatIdx);
//         render();
//     }
//
//     requestAnimationFrame(tick);
// }

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

function handleSongSelect(setlistIdx) {
    ctx.settings.activeSetlistIdx = setlistIdx;
    initBpm().then(() => render());
}

function handleSetlistSelect(setlistId) {
    if (ctx.settings.setlistId !== setlistId) {
        ctx.settings.activeSetlistIdx = 0;
        ctx.settings.setlistId = setlistId;
        initBpm().then(() => render());
    }
}

initBpm().then(() => render());
setUp()
    .then(() => console.log("Metronome setup done"))
    .then(render)
    .catch(e => console.log("Metronome Error", e));
