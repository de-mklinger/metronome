import {defaultAppState, defaultConfig} from "./env.js";
import {AppState, NewSetlist, NewSong, Setlist, SetlistWithSongs, Song, toNewSetlist, toNewSong} from "../types.ts";

const simulateSlow = false;

export type Repository = {
    getSongs: () => Promise<Song[]>,
    getSong: (id: string) => Promise<Song>,
    saveSong: (song: Song | NewSong) => Promise<Song>,
    getSetlists: () => Promise<SetlistWithSongs[]>,
    getSetlist: (id: string) => Promise<SetlistWithSongs>,
    getSetlistsWithSong: (id: string) => Promise<SetlistWithSongs[]>,
    addSongToSetlist: (setlistId: string, songId: string) => Promise<SetlistWithSongs>,
    removeSongFromSetlist: (setlistId: string, songId: string) => Promise<SetlistWithSongs>,
    saveSetlist: (setlist: Setlist | NewSetlist) => Promise<SetlistWithSongs>
    getAppState: () => Promise<AppState>,
    saveAppState: (appState: AppState) => Promise<AppState>
}

export type RepositoryImpl = {
    doGetSongs: () => Promise<Song[]>
    doGetSetlists: () => Promise<Setlist[]>,
    doSaveSongs: (songs: Song[]) => Promise<void>,
    doSaveSetlists: (songs: Setlist[]) => Promise<void>,
    doGetAppState: () => Promise<AppState>,
    doSaveAppState: (appState: AppState) => Promise<void>
}

export default function newRepository({doGetSongs, doGetSetlists, doSaveSongs, doSaveSetlists, doGetAppState, doSaveAppState}: RepositoryImpl) {
    const repository: Repository = {
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

    if (simulateSlow) {
        Object.keys(repository).forEach(key => {
            // @ts-expect-error Only for test
            const orig = repository[key];
            function slow() {
                return new Promise(resolve => {
                    console.warn("Simulating slow", key);
                    // eslint-disable-next-line prefer-rest-params
                    setTimeout(() => orig(...arguments).then(resolve), 5000);
                })
            }
            // @ts-expect-error Only for test
            repository[key] = slow;
        });
    }

    return repository;

    async function getSongs() {
        info("Repository: getSongs");
        return doGetSongs();
    }

    async function getSong(id: string) {
        info("Repository: getSong", id);
        const songs = await doGetSongs();
        return findById(songs, id);
    }

    async function saveSong(song: Song | NewSong) {
        info("Repository: saveSong", song);
        const songs = await doGetSongs();
        const addedSong = addSong(songs, song);
        await doSaveSongs(songs);
        return getSong(addedSong.id);
    }

    async function getSetlists(): Promise<SetlistWithSongs[]> {
        info("Repository: getSetlists");
        const setlists = await doGetSetlists();
        return Promise.all(setlists.map(setlistWithSongs));
    }

    async function getSetlist(id: string) {
        info("Repository: getSetlist", id);
        const setlists = await doGetSetlists();
        return setlistWithSongs(findById(setlists, id));
    }

    async function getSetlistsWithSong(songId: string): Promise<SetlistWithSongs[]> {
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

    async function addSongToSetlist(setlistId: string, songId: string) {
        info("Repository: addSongToSetlist", setlistId, songId);

        const setlists = await doGetSetlists();

        const setlist = findById(setlists, setlistId);
        setlist.songIds.push(songId);

        return setlistWithSongs(setlist);
    }

    async function removeSongFromSetlist(setlistId: string, songId: string) {
        info("Repository: removeSongFromSetlist", setlistId, songId);

        const setlists = await doGetSetlists();

        const setlist = findById(setlists, setlistId);
        setlist.songIds = setlist.songIds.filter(setlistSongId => setlistSongId !== songId);

        info("Repository: removeSongFromSetlist after:", setlist);
        info("Repository: all setlists:", setlists);

        return setlistWithSongs(setlist);
    }

    async function saveSetlist(setlist: Setlist | NewSetlist) {
        const setlists = await doGetSetlists();
        const savedSetlist = addSetlist(setlists, setlist);
        await doSaveSetlists(setlists.map(setlistWithoutSongs));
        return getSetlist(savedSetlist.id)
            .then(setlistWithSongs);
    }

    async function extendAppState(savedAppState: AppState) {
        const appState = {...savedAppState};

        if (savedAppState.activeSetlistId) {
            appState.setlist = await getSetlist(savedAppState.activeSetlistId);
        }

        appState.config = {...defaultConfig, ...appState.config}

        return appState;
    }

    async function getAppState() {
        info("Repository: getAppState");

        const savedAppState = await doGetAppState();

        if (!savedAppState) {
            return defaultAppState;
        } else {
            return extendAppState(savedAppState);
        }
    }

    async function saveAppState(appState: AppState) {
        // TODO try to save only once if this is invoked many times in sequence

        info("Repository: save app state: ", appState);

        const appStateToSave = reduceAppState(appState);

        await doSaveAppState(appStateToSave);

        return appState;
    }

    function reduceAppState(appState: AppState) {
        const reducedAppState = {...appState};

        if (reducedAppState.setlist) {
            reducedAppState.activeSetlistId = reducedAppState.setlist.id;
        }
        delete reducedAppState.setlist;

        return reducedAppState;
    }

    // ---- internal

    function findById<T extends {id?: string}>(haystack: T[], id: string): T {
        info("Repository: findById", id);

        const found = haystack.find(item => item.id === id);
        if (!found) {
            throw new Error('Not found: ' + id);
        }
        return found;
        // expression `haystack.find(..) ?? throw new Error(..)` not supported:
        // "Support for the experimental syntax 'throwExpressions' isn't currently enabled"
    }

    function addSong(haystack: Song[], song: Song | NewSong): Song {
        info("Repository: addSong", song);

        if ("id" in song && song.id) {
            replace(haystack, song);
            return song;
        } else {
            const newObject = {
                id: newRandomId(),
                ...toNewSong(song)
            }
            haystack.push(newObject);
            return newObject;
        }
    }

  function addSetlist(haystack: Setlist[], setlist: Setlist | NewSetlist): Setlist {
    info("Repository: addSetlist", setlist);

    if ("id" in setlist && setlist.id) {
      replace(haystack, setlist);
      return setlist;
    } else {
      const newObject = {
        id: newRandomId(),
        ...toNewSetlist(setlist)
      }
      haystack.push(newObject);
      return newObject;
    }
  }

  function replace<T extends {id?: string}>(haystack: T[], object: T) {
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
                id += r.toString(16).substring(2);
            }
        }
        return id.substring(0, len);
    }

    async function setlistWithSongs(setlist: Setlist): Promise<SetlistWithSongs> {
        const songs = await Promise.all(setlist.songIds
            .map(getSong));
        return { ...setlist, songs: songs };
    }

    function setlistWithoutSongs(setlist: Setlist | SetlistWithSongs): Setlist {
        return {
            id: setlist.id,
            title: setlist.title,
            songIds: [...setlist.songIds]
        }
    }

    function containsSong(setlist: Setlist, songId: string) {
        return setlist.songIds.findIndex(setlistSongId =>
            setlistSongId === songId) !== -1;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function info(...args: unknown[]) {
        //console.log(...args);
    }
}

