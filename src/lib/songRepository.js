import {allSongs, allSetlists} from "./songRepository.testFixtures";

const songRepository = {
    getSongs: async () => allSongs,
    getSong: async id => findById(allSongs, id),
    saveSong: async song => save(allSongs, song),
    getSetlists: async () => Promise.all(allSetlists.map(setlistWithSongs)),
    getSetlist: async id => setlistWithSongs(findById(allSetlists, id)),
    getSetlistsWithSong: async songId => getSetlistsWithSong(songId),
    addSongToSetlist: async (setlistId, songId) => addSongToSetlist(setlistId, songId),
    removeSongFromSetlist: async (setlistId, songId) => removeSongFromSetlist(setlistId, songId),
    saveSetlist: async setlist => save(allSetlists, setlist)
}

const info = function() {
    //console.log(...arguments);
}

const getSetlistsWithSong = async songId => {
    return Promise.all(allSetlists
        .filter(setlist => containsSong(setlist, songId))
        .map(setlistWithSongs));
};

const addSongToSetlist = async (setlistId, songId) => {
    info("Repository: addSongToSetlist", setlistId, songId);

    const setlist = findById(allSetlists, setlistId);
    setlist.songIds.push(songId);

    return setlist;
}

const removeSongFromSetlist = async (setlistId, songId) => {
    info("Repository: removeSongFromSetlist", setlistId, songId);
    
    const setlist = findById(allSetlists, setlistId);
    setlist.songIds = setlist.songIds.filter(setlistSongId => setlistSongId !== songId);

    return setlist;
}

const containsSong = (setlist, songId) => setlist.songIds.find(setlistSongId => setlistSongId === songId) !== null

// const slowFindById = async (haystack, id) => {
//     return new Promise(resolve => {
//         setTimeout(() => resolve(findById(haystack, id)), 500);
//     });
// }

const findById = (haystack, id) => {
    info("Repository: findById", id);

    const found = haystack.find(item => item.id === id);
    if (!found) {
        throw new Error('Not found: ' + id);
    }
    return found;
    // expression `haystack.find(..) ?? throw new Error(..)` not supported:
    // "Support for the experimental syntax 'throwExpressions' isn't currently enabled"
}

const save = (haystack, object) => {
    info("Repository: save", object);

    if (object.id === null) {
        object.id = newRandomId();
        haystack.push(object);
    } else {
        replace(haystack, object);
    }
    return object;
}

const newRandomId = (len = 16) => {
    let id = "";
    while (id.length < len) {
        const r = Math.random();
        if (r !== 0) {
            id += r.toString(16).substr(2);
        }
    }
    return id.substr(0, len);
}

const replace = (haystack, object) => {
    const idx = haystack.findIndex(item => item.id === object.id);
    if (idx === -1) {
        throw new Error('Not found: ' + object.id);
    }
    haystack[idx] = object;
}

const setlistWithSongs = async setlist =>
    getSongs(setlist.songIds)
        .then(songs => Object.assign({}, setlist,{ songs: songs }));

const getSongs = async songIds => {
    return Promise.all(songIds.map(songRepository.getSong));
}

export default songRepository;