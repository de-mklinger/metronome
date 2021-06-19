import silenceWav from '../sounds/silence.wav';

let audioContext = null;

const getAudioContext = () => {
    if (audioContext === null) {
        // Fix iOS Audio Context:
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    return audioContext;
}

let silenceAudioBuffer = null;
getAudioBuffer(silenceWav).then(buf => silenceAudioBuffer = buf);

//const silenceAudioBuffer = audioContext.createBuffer(2, 1000, 44100);

const resumeAudioContext = function () {
    if (getAudioContext().state !== 'running') {
        console.log("Trying to resume Audio Context")
        getAudioContext().resume().then(() => "Audio context resumed");
    } else {
        console.log("Audio Context is running")
    }
};

document.addEventListener('touchstart', resumeAudioContext);
document.addEventListener('mousedown', resumeAudioContext);

function playSilence() {
    if (silenceAudioBuffer === null) {
        console.log("Silence audio buffer not yet loaded");
    } else {
        //console.log("Play silence");
        playSample(silenceAudioBuffer);
    }
}

function playSample(audioBuffer, playTime = null) {
    getSampleSource(audioBuffer).start(playTime);
}

function getTime(whenOffsetSeconds = 0) {
    return whenOffsetSeconds + getAudioContext().currentTime;
}

function getSampleSource(audioBuffer) {
    let audioContext = getAudioContext();

    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioContext.destination)

    return sampleSource;
}

async function getAudioBuffer(filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();

    // Modern API:
    // return await getAudioContext().decodeAudioData(arrayBuffer, (x) => alert(x), () => alert("error"));

    // IOS Safari:
    return new Promise((resolve, reject) => {
        getAudioContext().decodeAudioData(
            arrayBuffer,
            (x) => resolve(x),
            (x) => reject(x));
    });
}

export { playSample, playSilence, getAudioBuffer, getAudioContext, getTime }
