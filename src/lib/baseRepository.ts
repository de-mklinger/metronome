import { defaultAppState } from "./env.js";
import {
  AppState,
  Config,
  NewSetlist,
  NewSong,
  Setlist,
  SetlistWithSongs,
  Song,
  toNewSetlist,
  toNewSong,
} from "../types.ts";

const simulateSlow = false;

export type Repository = {
  getSongs: () => Promise<Song[]>;
  getSong: (id: string) => Promise<Song>;
  saveSong: (song: Song | NewSong) => Promise<Song>;
  getSetlists: () => Promise<SetlistWithSongs[]>;
  getSetlist: (id: string) => Promise<SetlistWithSongs>;
  getSetlistsWithSong: (id: string) => Promise<SetlistWithSongs[]>;
  addSongToSetlist: (
    setlistId: string,
    songId: string,
  ) => Promise<SetlistWithSongs>;
  removeSongFromSetlist: (
    setlistId: string,
    songId: string,
  ) => Promise<SetlistWithSongs>;
  saveSetlist: (setlist: Setlist | NewSetlist) => Promise<SetlistWithSongs>;
  getAppState: () => Promise<AppState>;
  saveAppState: (appState: AppState) => Promise<AppState>;
};

export type RepositoryImpl = {
  doGetSongs: () => Promise<Song[]>;
  doGetSetlists: () => Promise<Setlist[]>;
  doSaveSongs: (songs: Song[]) => Promise<void>;
  doSaveSetlists: (songs: Setlist[]) => Promise<void>;
  doGetAppState: () => Promise<PersistentAppState | undefined>;
  doSaveAppState: (appState: PersistentAppState) => Promise<void>;
};

export type BasePersistentAppState = {
  config: Config;
};
export type SetlistPersistentAppState = BasePersistentAppState & {
  setlistId: string;
  songIdx: number;
};
export type SongPersistentAppState = BasePersistentAppState & {
  song: NewSong | Song | string;
};
export type PersistentAppState =
  | SetlistPersistentAppState
  | SongPersistentAppState;

export function setlistWithoutSongs(
  setlist: Setlist | SetlistWithSongs,
): Setlist {
  return {
    id: setlist.id,
    title: setlist.title,
    songIds: [...setlist.songIds],
  };
}

export default function newRepository({
  doGetSongs,
  doGetSetlists,
  doSaveSongs,
  doSaveSetlists,
  doGetAppState,
  doSaveAppState,
}: RepositoryImpl) {
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
    saveAppState: saveAppState,
  };

  if (simulateSlow) {
    Object.keys(repository).forEach((key) => {
      // @ts-expect-error Only for test
      const orig = repository[key];

      function slow() {
        return new Promise((resolve) => {
          console.warn("Simulating slow", key);
          // eslint-disable-next-line prefer-rest-params
          setTimeout(() => orig(...arguments).then(resolve), 5000);
        });
      }

      // @ts-expect-error Only for test
      repository[key] = slow;
    });
  }

  return repository;

  async function getSongs() {
    debug("Repository: getSongs");
    return doGetSongs();
  }

  async function getSong(id: string) {
    debug("Repository: getSong", id);
    const songs = await doGetSongs();
    return findById(songs, id);
  }

  async function saveSong(song: Song | NewSong) {
    debug("Repository: saveSong", song);
    const songs = await doGetSongs();
    const addedSong = addSong(songs, song);
    await doSaveSongs(songs);
    return getSong(addedSong.id);
  }

  async function getSetlists(): Promise<SetlistWithSongs[]> {
    debug("Repository: getSetlists");
    const setlists = await doGetSetlists();
    return Promise.all(setlists.map(setlistWithSongs));
  }

  async function getSetlist(id: string) {
    debug("Repository: getSetlist", id);
    const setlists = await doGetSetlists();
    return setlistWithSongs(findById(setlists, id));
  }

  async function getSetlistsWithSong(
    songId: string,
  ): Promise<SetlistWithSongs[]> {
    debug("Repository: getSetlistsWithSong", songId);

    const setlists = await doGetSetlists();

    debug("Repository: all setlists:", setlists);

    return Promise.all(
      setlists
        .filter((setlist) => containsSong(setlist, songId))
        .map(setlistWithSongs)
        .map((setlist) => {
          debug("Repository: getSetlistsWithSong found ", setlist);
          return setlist;
        }),
    );
  }

  async function addSongToSetlist(setlistId: string, songId: string) {
    debug("Repository: addSongToSetlist", setlistId, songId);

    const setlist = await getSetlist(setlistId);

    setlist.songIds.push(songId);

    return saveSetlist(setlist);
  }

  async function removeSongFromSetlist(setlistId: string, songId: string) {
    debug("Repository: removeSongFromSetlist", setlistId, songId);

    const setlist = await getSetlist(setlistId);

    setlist.songIds = setlist.songIds.filter(
      (setlistSongId) => setlistSongId !== songId,
    );

    return saveSetlist(setlist);
  }

  async function saveSetlist(setlist: Setlist | NewSetlist) {
    debug("Repository: saveSetlist", setlist);

    const setlists = await doGetSetlists();
    const savedSetlist = addSetlist(setlists, setlist);
    await doSaveSetlists(setlists.map(setlistWithoutSongs));
    return getSetlist(savedSetlist.id).then(setlistWithSongs);
  }

  async function fromPersistentAppState(
    persistentAppState: PersistentAppState,
  ) {
    if ("setlistId" in persistentAppState) {
      const setlist = await getSetlist(persistentAppState.setlistId);
      const songIdx = persistentAppState.songIdx;
      const song = setlist.songs[songIdx];
      return {
        config: { ...persistentAppState.config },
        setlist,
        songIdx,
        song,
      };
    } else {
      let song: Song | NewSong;
      if (typeof persistentAppState.song === "string") {
        song = await getSong(persistentAppState.song);
      } else {
        song = {
          ...persistentAppState.song,
        };
      }
      return {
        config: { ...persistentAppState.config },
        song,
      };
    }
  }

  async function getAppState() {
    debug("Repository: getAppState");

    const savedAppState = await doGetAppState();

    if (!savedAppState) {
      return defaultAppState;
    } else {
      return fromPersistentAppState(savedAppState);
    }
  }

  async function saveAppState(appState: AppState) {
    // TODO try to save only once if this is invoked many times in sequence

    debug("Repository: save app state: ", appState);

    const appStateToSave = toPersistentAppState(appState);

    await doSaveAppState(appStateToSave);

    return appState;
  }

  function toPersistentAppState(appState: AppState): PersistentAppState {
    if (appState.setlist) {
      return {
        config: { ...appState.config },
        setlistId: appState.setlist.id,
        songIdx: appState.songIdx ?? 0,
      };
    } else {
      return {
        config: { ...appState.config },
        song: { ...appState.song },
      };
    }
  }

  // ---- internal

  function findById<T extends { id?: string }>(haystack: T[], id: string): T {
    debug("Repository: findById", id);

    const found = haystack.find((item) => item.id === id);
    if (!found) {
      throw new Error("Not found: " + id);
    }
    return found;
    // expression `haystack.find(..) ?? throw new Error(..)` not supported:
    // "Support for the experimental syntax 'throwExpressions' isn't currently enabled"
  }

  function addSong(haystack: Song[], song: Song | NewSong): Song {
    debug("Repository: addSong", song);

    if ("id" in song && song.id) {
      addOrReplace(haystack, song);
      return song;
    } else {
      const newObject = {
        id: newRandomId(),
        ...toNewSong(song),
      };
      haystack.push(newObject);
      return newObject;
    }
  }

  function addSetlist(
    haystack: Setlist[],
    setlist: Setlist | NewSetlist,
  ): Setlist {
    debug("Repository: addSetlist", setlist);

    if ("id" in setlist && setlist.id) {
      addOrReplace(haystack, setlist);
      return setlist;
    } else {
      const newObject = {
        id: newRandomId(),
        ...toNewSetlist(setlist),
      };
      haystack.push(newObject);
      return newObject;
    }
  }

  function addOrReplace<T extends { id?: string }>(haystack: T[], object: T) {
    const idx = haystack.findIndex((item) => item.id === object.id);
    if (idx !== -1) {
      haystack[idx] = object;
    } else {
      haystack.push(object);
    }
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
    const songs = await Promise.all(setlist.songIds.map(getSong));
    return { ...setlist, songs: songs };
  }

  function containsSong(setlist: Setlist, songId: string) {
    return (
      setlist.songIds.findIndex((setlistSongId) => setlistSongId === songId) !==
      -1
    );
  }

  function debug(...args: unknown[]) {
    console.debug(...args);
  }
}
