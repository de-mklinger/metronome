const localStorageSongRepository = {
    getSongs: getSongs,
    getSong: getSong,
    saveSong: saveSong,
    getSetlists: getSetlists,
    getSetlist: getSetlist,
    getSetlistsWithSong: getSetlistsWithSong,
    addSongToSetlist: addSongToSetlist,
    removeSongFromSetlist: removeSongFromSetlist,
    saveSetlist: saveSetlist
}

export default localStorageSongRepository;

async function getSongs() {
    info("Repository: getSongs");
    return doGetSongs();
}

async function getSong(id) {
    info("Repository: getSong", id);
    const songs = await doGetSongs();
    return findById(songs, id);
}

async function saveSong(song) {
    info("Repository: saveSong", song);
    const songs = await doGetSongs();
    const addedSong = add(songs, song);
    await doSaveSongs(songs);
    return getSong(addedSong.id);
}

async function getSetlists() {
    info("Repository: getSetlists");
    const setlists = await doGetSetlists();
    return Promise.all(setlists.map(setlistWithSongs));
}

async function getSetlist(id) {
    info("Repository: getSetlist", id);
    const setlists = await doGetSetlists();
    return setlistWithSongs(findById(setlists, id));
}

async function getSetlistsWithSong(songId) {
    info("Repository: getSetlistsWithSong", songId);

    const setlists = await doGetSetlists();

    info("Repository: all setlists:", setlists);

    return Promise.all(setlists
        .filter(setlist => containsSong(setlist, songId))
        .map(setlistWithSongs)
        .map(setlist => {
            info("Repository: getSetlistsWithSong found ", setlist);
            return setlist;
        })
    );
}

async function addSongToSetlist(setlistId, songId) {
    info("Repository: addSongToSetlist", setlistId, songId);

    const setlists = await doGetSetlists();

    const setlist = findById(setlists, setlistId);
    setlist.songIds.push(songId);

    return setlistWithSongs(setlist);
}

async function removeSongFromSetlist(setlistId, songId) {
    info("Repository: removeSongFromSetlist", setlistId, songId);

    const setlists = await doGetSetlists();

    const setlist = findById(setlists, setlistId);
    setlist.songIds = setlist.songIds.filter(setlistSongId => setlistSongId !== songId);

    info("Repository: removeSongFromSetlist after:", setlist);
    info("Repository: all setlists:", setlists);

    return setlistWithSongs(setlist);
}

async function saveSetlist(setlist) {
    const setlists = await doGetSetlists();
    const savedSetlist = add(setlists, setlist);
    await doSaveSetlists(setlists);
    return getSetlist(savedSetlist.id);
}

// ---- internal

function findById(haystack, id) {
    info("Repository: findById", id);

    const found = haystack.find(item => item.id === id);
    if (!found) {
        throw new Error('Not found: ' + id);
    }
    return found;
    // expression `haystack.find(..) ?? throw new Error(..)` not supported:
    // "Support for the experimental syntax 'throwExpressions' isn't currently enabled"
}

function add(haystack, object) {
    info("Repository: add", object);

    if (object.id) {
        replace(haystack, object);
    } else {
        object.id = newRandomId();
        haystack.push(object);
    }
    return object;
}

const replace = (haystack, object) => {
    const idx = haystack.findIndex(item => item.id === object.id);
    if (idx === -1) {
        throw new Error('Not found: ' + object.id);
    }
    haystack[idx] = object;
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

async function setlistWithSongs(setlist) {
    return getSongs(setlist.songIds)
        .then(songs => Object.assign({}, setlist, {songs: songs}));
}

function containsSong(setlist, songId) {
    return setlist.songIds.findIndex(setlistSongId =>
        setlistSongId === songId) !== -1;
}


function info() {
    //console.log(...arguments);
}

// --- impl specific

async function doGetSongs() {
    return JSON.parse(window.localStorage.getItem("songs") || "[]");
}

async function doSaveSongs(songs) {
    window.localStorage.setItem("songs", JSON.stringify(songs));
}

async function doGetSetlists() {
    return JSON.parse(window.localStorage.getItem("setlists") || "[]");
}

async function doSaveSetlists(setlists) {
    window.localStorage.setItem("setlists", JSON.stringify(setlists));
}
