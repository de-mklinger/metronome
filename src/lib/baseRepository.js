import {defaultAppState} from "../components/app-state";

export default function newRepository({doGetSongs, doGetSetlists, doSaveSongs, doSaveSetlists, doGetAppState, doSaveAppState}) {
    return {
        getSongs: getSongs,
        getSong: getSong,
        saveSong: saveSong,
        getSetlists: getSetlists,
        getSetlist: getSetlist,
        getSetlistsWithSong: getSetlistsWithSong,
        addSongToSetlist: addSongToSetlist,
        removeSongFromSetlist: removeSongFromSetlist,
        saveSetlist: saveSetlist,
        getAppState: getAppState,
        saveAppState: saveAppState
    }

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
        await doSaveSetlists(setlists.map(setlistWithoutSongs));
        return getSetlist(savedSetlist.id)
            .then(setlistWithSongs);
    }

    async function extendAppState(savedAppState) {
        const appState = {
            activeSetlistIdx: savedAppState.activeSetlistIdx,
            song: savedAppState.song
        }

        if (savedAppState.activeSetlistId) {
            appState.setlist = await getSetlist(savedAppState.activeSetlistId);
        }
        return appState;
    }

    async function getAppState() {
        const savedAppState = await doGetAppState();

        if (!savedAppState) {
            return defaultAppState;
        } else {
            return extendAppState(savedAppState);
        }
    }

    async function saveAppState(appState) {
        const appStateToSave = reduceAppState(appState);

        console.log("Repository: save app state: ", appState);

        doSaveAppState(appStateToSave);

        return appState;
    }

    function reduceAppState(appState) {
        return {
            activeSetlistId: appState.setlist ? appState.setlist.id : null,
            activeSetlistIdx: appState.activeSetlistIdx,
            song: appState.song
        };
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

    function replace(haystack, object) {
        const idx = haystack.findIndex(item => item.id === object.id);
        if (idx === -1) {
            throw new Error('Not found: ' + object.id);
        }
        haystack[idx] = object;
    }

    function newRandomId(len = 16) {
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
        const songs = await Promise.all(setlist.songIds
            .map(getSong));
        return { ...setlist, songs: songs };
    }

    function setlistWithoutSongs(setlist) {
        const newSetlist = { ...setlist };
        delete newSetlist.songs;
        return newSetlist;
    }

    function containsSong(setlist, songId) {
        return setlist.songIds.findIndex(setlistSongId =>
            setlistSongId === songId) !== -1;
    }

    function info() {
        //console.log(...arguments);
    }
}
