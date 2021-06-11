import silenceWav from '../sounds/silence.wav';

export { playSample, playSilence, getAudioBuffer }

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

const fixAudioContext = function () {
    if (getAudioContext().state !== 'running') {
        console.log("Resume Audio Context")
        getAudioContext().resume().then(() => playSilence());
    }
};
document.addEventListener('touchstart', fixAudioContext);
document.addEventListener('mousedown', fixAudioContext);

function playSilence() {
    if (silenceAudioBuffer === null) {
        console.log("Silence audio buffer not yet loaded");
    } else {
        //console.log("Play silence");
        playSample(silenceAudioBuffer);
    }
}

function playSample(audioBuffer, whenOffsetSeconds = 0) {
    const sampleSource = getAudioContext().createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(getAudioContext().destination)
    sampleSource.start(whenOffsetSeconds + getAudioContext().currentTime);
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
