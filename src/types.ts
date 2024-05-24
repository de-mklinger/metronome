import isPlainOldObject from "./lib/is-plain-old-object.ts";

export type Accent = 1 | 2 | 3;

export function isAccent(x: unknown): x is Accent {
  return typeof x === "number" && Number.isFinite(x) && x >= 1 && x <= 3;
}

export type TimeSignatureBeats =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16;

export function isTimeSignatureBeats(x: unknown): x is TimeSignatureBeats {
  return typeof x === "number" && Number.isFinite(x) && x >= 1 && x <= 16;
}

export type TimeSignatureNoteValue = 1 | 2 | 4 | 8;

export function isTimeSignatureNoteValue(
  x: unknown,
): x is TimeSignatureNoteValue {
  return typeof x === "number" && [1, 2, 4, 8].includes(x);
}

export type Song = {
  id: string;
  bpm: number;
  title: string;
  timeSignatureBeats: TimeSignatureBeats;
  timeSignatureNoteValue: TimeSignatureNoteValue;
  subDivisions: number;
  accents: Accent[];
};

function isSong(x: unknown): x is Song {
  return isPlainOldObject(x) && typeof x.id === "string" && isNewSong(x);
}

export function toNewSong(song: Song | NewSong | SongWithSetlists): NewSong {
  return {
    bpm: song.bpm,
    title: song.title,
    timeSignatureBeats: song.timeSignatureBeats,
    timeSignatureNoteValue: song.timeSignatureNoteValue,
    subDivisions: song.subDivisions,
    accents: [...song.accents],
  };
}

export type NewSong = Omit<Song, "id">;

function isNewSong(x: unknown): x is NewSong {
  return (
    isPlainOldObject(x) &&
    typeof x.bpm === "number" &&
    typeof x.title === "string" &&
    isTimeSignatureBeats(x.timeSignatureBeats) &&
    isTimeSignatureNoteValue(x.timeSignatureNoteValue) &&
    typeof x.subDivisions === "number" &&
    Array.isArray(x.accents) &&
    !x.accents.some((a) => !isAccent(a))
  );
}

export type SongWithSetlists = Song & {
  setlists?: Setlist[]; // TODO
  setlistIds?: string[]; // TODO
};

export type Setlist = {
  id: string;
  title: string;
  songIds: string[];
};

function isSetlist(x: unknown): x is Setlist {
  return (
    isPlainOldObject(x) &&
    typeof x.id === "string" &&
    typeof x.title === "string" &&
    Array.isArray(x.songIds) &&
    !x.songIds.some((s) => typeof s !== "string")
  );
}

export function toNewSetlist(
  setlist: Setlist | NewSetlist | SetlistWithSongs,
): NewSetlist {
  return {
    title: setlist.title,
    songIds: [...setlist.songIds],
  };
}

export type NewSetlist = Omit<Setlist, "id">;

export type SetlistWithSongs = Setlist & {
  songs: Song[]; // TODO
};

function isSetlistWithSongs(x: unknown): x is SetlistWithSongs {
  return (
    isPlainOldObject(x) &&
    Array.isArray(x.songs) &&
    !x.songs.some((s) => !isSong(s)) &&
    isSetlist(x)
  );
}

export type NewSetlistWithSongs = Omit<SetlistWithSongs, "id">;

export type KeyConfig = {
  playKey: string;
  nextSongKey: string;
  previousSongKey: string;
};

export type Config = KeyConfig & {
  noSleepAlways: boolean;
  noSleepWhenStarted: boolean;
  splashAlways: boolean;
};

function isConfig(x: unknown): x is Config {
  return (
    isPlainOldObject(x) &&
    typeof x.noSleepAlways === "boolean" &&
    typeof x.noSleepWhenStarted === "boolean" &&
    typeof x.splashAlways === "boolean" &&
    typeof x.playKey === "string" &&
    typeof x.nextSongKey === "string" &&
    typeof x.previousSongKey === "string"
  );
}

export type ConfigKey = keyof KeyConfig;

export type AppState = {
  config: Config;
  setlist?: SetlistWithSongs;
  songIdx?: number;
  song: Song | NewSong;
};

export function isAppState(x: unknown): x is AppState {
  return (
    isPlainOldObject(x) &&
    isConfig(x.config) &&
    (x.setlist === undefined || isSetlistWithSongs(x.setlist)) &&
    (x.activeSetlistIdx === undefined || typeof x.activeSetlistIdx === "number") &&
    (isSong(x.song) || isNewSong(x.song))
  );
}

export type AudioData = {
  accentAudioBuffer?: AudioBuffer;
  nonAccentAudioBuffer?: AudioBuffer;
};
