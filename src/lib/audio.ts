let audioContext: AudioContext | null = null;

const getAudioContext = () => {
    if (audioContext === null) {
        // Fix iOS Audio Context:
        // @ts-expect-error window.webkitAudioContext is not known
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    return audioContext;
}

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

function playSample(audioBuffer: AudioBuffer, playTime?: number) {
    getSampleSource(audioBuffer).start(playTime);
}

function getTime(whenOffsetSeconds = 0) {
    return whenOffsetSeconds + getAudioContext().currentTime;
}

function getSampleSource(audioBuffer: AudioBuffer) {
    const audioContext = getAudioContext();

    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioContext.destination)

    return sampleSource;
}

async function getAudioBuffer(filepath: string): Promise<AudioBuffer> {
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

export { playSample, getAudioBuffer, getAudioContext, getTime }
