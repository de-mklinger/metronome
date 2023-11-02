import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/index.scss';
import App from './components/App.tsx';
import {ctx} from './index.testFixtures'
import {getAudioBuffer, playSilence} from './lib/audio.ts'
import Cowbell1 from './sounds/Cowbell-1-enh.wav'
import Cowbell2 from './sounds/Cowbell-2-enh.wav'
import {playSilenceIntervalMillis} from "./lib/env";

function createRoot() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>,
  )
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

  //console.log("State:", getAudioContext().state);

  return ctx;
}

// TODO
setUp()
  .then(() => console.log("Metronome setup done"))
  .then(createRoot)
  .catch(e => console.log("Metronome Error", e));

