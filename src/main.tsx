import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.scss";
import App from "./components/App.tsx";
import { ctx } from "./index.testFixtures";
import {getAudioBuffer, playSample} from "./lib/audio.ts";
import Cowbell1 from "./sounds/Cowbell-1-enh.wav";
import Cowbell2 from "./sounds/Cowbell-2-enh.wav";
import Silence from "./sounds/silence.wav";
import { playSilenceIntervalMillis } from "./lib/env";

function createRoot() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

async function setUp() {
  const [accentAudioBuffer, nonAccentAudioBuffer, silenceAudioBuffer] =
    await Promise.all([
      getAudioBuffer(Cowbell2),
      getAudioBuffer(Cowbell1),
      getAudioBuffer(Silence),
    ]);

  ctx.audio = {
    accentAudioBuffer,
    nonAccentAudioBuffer
  }

  if (playSilenceIntervalMillis > 0) {
    setInterval(() => {
      //console.log("Play silence");
      playSample(silenceAudioBuffer);
    }, playSilenceIntervalMillis);
  }

  //console.log("State:", getAudioContext().state);

  return ctx;
}

// TODO
setUp()
  .then(() => console.log("Metronome setup done"))
  .then(createRoot)
  .catch((e) => console.log("Metronome Error", e));
