import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import './styles/index.scss';
import App from './components/App';
import {ctx} from './index.testFixtures'
import {getAudioBuffer, playSilence} from './lib/audio'
import Cowbell1 from './sounds/Cowbell-1.wav'
import Cowbell2 from './sounds/Cowbell-2.wav'
import {playSilenceIntervalMillis} from "./lib/env";

function render() {
    ReactDOM.render(
        <React.StrictMode>
            <App />
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

    if (playSilenceIntervalMillis > 0) {
        setInterval(() => {
            //console.log("Play silence");
            playSilence();
        }, playSilenceIntervalMillis);
    }

    //console.log("State:", getAudioContext().state);

    return ctx;
}

render();
setUp()
    .then(() => console.log("Metronome setup done"))
    .then(render)
    .catch(e => console.log("Metronome Error", e));
