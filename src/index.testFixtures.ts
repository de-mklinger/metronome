import {jsssSetlist} from './lib/inMemoryRepository.testFixtures'
import {AudioData} from "./types.ts";

// TODO
export type Ctx = Record<string, unknown> & {
    audio: AudioData
}

export const ctx: Ctx = {
    // user settings
    settings: {
        //bpm: 120,
        timeSignatureBeats: 4,
        timeSignatureNoteValue: 4,
        accentBeatIndices: [0],
        setlistId: jsssSetlist.id,
        activeSetlistIdx: 0
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
        accentAudioBuffer: undefined,
        nonAccentAudioBuffer: undefined
    }
}
