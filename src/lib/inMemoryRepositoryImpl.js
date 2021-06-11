import {allSetlists, allSongs, appState} from "./inMemoryRepository.testFixtures";

const inMemoryRepositoryImpl = {
    doGetSongs: async () => {
        return [ ...allSongs ];
    },

    doSaveSongs: async (songs) => {
        allSongs.splice(0, allSongs.length);
        songs.forEach(song => allSongs.push(song));
    },

    doGetSetlists: async () => {
        return [ ...allSetlists ];
    },

    doSaveSetlists: async (setlists) => {
        allSetlists.splice(0, allSetlists.length);
        setlists.forEach(setlist => allSetlists.push(setlist));
    },

    doGetAppState: async () => {
        return { ...appState };
    },

    doSaveAppState: async (appStateToSave) => {
        Object.keys(appState).forEach(key => delete appState[key]);
        Object.keys(appStateToSave).forEach(key => appState[key] = appStateToSave[key]);
    }
}

export default inMemoryRepositoryImpl;