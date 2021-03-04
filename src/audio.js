import silenceWav from './sounds/silence.wav';

export { playSample, playSilence, getAudioBuffer }

// Fix iOS Audio Context:
window.AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new window.AudioContext();

let silenceAudioBuffer = null;
getAudioBuffer(silenceWav).then(buf => silenceAudioBuffer = buf);

//const silenceAudioBuffer = audioContext.createBuffer(2, 1000, 44100);

const fixAudioContext = function () {
    if (audioContext.state !== 'running') {
        console.log("Resume Audio Context")
        audioContext.resume().then(() => playSilence());
    }
};
document.addEventListener('touchstart', fixAudioContext);
document.addEventListener('mousedown', fixAudioContext);

function playSilence() {
    if (silenceAudioBuffer === null) {
        console.log("Silence audio buffer not yet loaded");
    } else {
        console.log("Play silence");
        playSample(silenceAudioBuffer);
    }
}

function playSample(audioBuffer, whenOffsetSeconds = 0) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioContext.destination)
    sampleSource.start(whenOffsetSeconds + audioContext.currentTime);
    return sampleSource;
}

async function getAudioBuffer(filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();

    // Modern API:
    // return await audioContext.decodeAudioData(arrayBuffer, (x) => alert(x), () => alert("error"));

    // IOS Safari:
    return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(
            arrayBuffer,
            (x) => resolve(x),
            (x) => reject(x));
    });
}
