import {allSetlists, allSongs, appState} from "./inMemoryRepository.testFixtures.js";
import {RepositoryImpl} from "./baseRepository.ts";
import {AppState, Setlist, Song} from "../types.ts";

let inMemoryAppState: AppState = copy(appState);
let inMemorySongs: Song[] = copy(allSongs);
let inMemorySetlists: Setlist[] = copy(allSetlists);

const inMemoryRepositoryImpl: RepositoryImpl = {
    doGetSongs: async () => {
        return copy(inMemorySongs);
    },

    doSaveSongs: async (songs) => {
        inMemorySongs = copy(songs);
    },

    doGetSetlists: async () => {
        return copy(inMemorySetlists);
    },

    doSaveSetlists: async (setlists) => {
        inMemorySetlists = copy(setlists);
    },

    doGetAppState: async () => {
        return copy(inMemoryAppState);
    },

    doSaveAppState: async (appStateToSave) => {
        inMemoryAppState = copy(appStateToSave);
    }
}

function copy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
}

export default inMemoryRepositoryImpl;
