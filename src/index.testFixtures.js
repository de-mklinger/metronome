import {jsssSetlist} from './lib/songRepository.testFixtures'

export const ctx = {
    // user settings
    settings: {
        //bpm: 120,
        timeSignatureBeats: 4,
        timeSignatureNoteValue: 4,
        accentBeatIndices: [0],
        setlistId: jsssSetlist.id,
        activeSetlistIdx: 0
    },

    // reasonable base settings
    config: {
        defaultBpm: 120, // ui
        rotationFactor: 0.05, // wheel-ux. Multiplied with 0°-360°
        earlyPlayThresholdMillis: -18, // animation frame dependent. Assuming 60 FPS, actually 16.6666.
        minBpm: 1, // const. Can we go back in time, or stay forever?
        maxBpm: 400,
        playSilenceIntervalMillis: 10000,
        missMillisThreshold: 100,
    },

    // internal state
    state: {
        started: false,
        activeBeatIdx: -1,
        switchTime: 0,
    },

    metrics: {
        lastStartTime: 0
    },

    audio: {
    }
}