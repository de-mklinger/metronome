const envNumber = (name, defaultValue) => Number(process.env["REACT_APP_" + name] || defaultValue);

// ui
const defaultBpm = envNumber("DEFAULT_BPM", 120);

// wheel-ux. Multiplied with 0°-360°
const rotationFactor = envNumber("ROTATION_FACTOR", 0.05);

// const. Can we go back in time, or stay forever?
const minBpm = envNumber("MIN_BPM", 1);

// come default
const maxBpm = envNumber("MAX_BPM", 400);

// animation frame dependent. Assuming 60 FPS, actually 16.6666.
const earlyPlayThresholdMillis = envNumber("EARLY_PLAY_THRESHOLD_MILLIS", -18);

const playSilenceIntervalMillis = envNumber("PLAY_SILENCE_INTERVAL_MILLIS", 10000);
const missMillisThreshold = envNumber("MISS_MILLIS_THRESHOLD", 100);

const defaultSong = {
    bpm: defaultBpm,
    title: "",
    timeSignatureBeats: 4,
    timeSignatureNoteValue: 4,
    subDivisions: 1,
    songLength: null,
    accents: [2, 1, 1, 1],
    // created, updated, owner, tenant, ...
}

const defaultSetlist = {
    title: "",
    archived: false,
    songIds: []
}

const defaultAppState = {
    song: defaultSong,
    setlist: null,
    activeSetlistIdx: 0
}

export {
    defaultAppState,
    defaultBpm,
    defaultSong,
    defaultSetlist,
    rotationFactor,
    minBpm,
    maxBpm,
    earlyPlayThresholdMillis,
    playSilenceIntervalMillis,
    missMillisThreshold
}