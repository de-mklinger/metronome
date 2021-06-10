import {allSetlists, allSongs} from "./inMemoryRepository.testFixtures";

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
    }
}

export default inMemoryRepositoryImpl;