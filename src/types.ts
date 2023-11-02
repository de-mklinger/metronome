export type Accent = 1 | 2 | 3;

export function isAccent(x: unknown): x is Accent {
  return typeof x === "number" && Number.isFinite(x) && x >= 1 && x <= 3;
}

export type TimeSignatureBeats = 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16;

export function isTimeSignatureBeats(x: unknown): x is TimeSignatureBeats {
  return typeof x === "number" && Number.isFinite(x) && x >= 1 && x <= 16;
}

export type TimeSignatureNoteValue = 1|2|4|8;

export function isTimeSignatureNoteValue(x: unknown): x is TimeSignatureNoteValue {
  return typeof x === "number" && [1,2,4,8].includes(x);
}

export type Song = {
  id: string,
  bpm: number,
  title: string,
  timeSignatureBeats: TimeSignatureBeats,
  timeSignatureNoteValue: TimeSignatureNoteValue,
  subDivisions: number,
  songLength?: number,
  accents: Accent[],
}

export function toNewSong(song: Song | NewSong | SongWithSetlists): NewSong {
  return {
    bpm: song.bpm,
    title: song.title,
    timeSignatureBeats: song.timeSignatureBeats,
    timeSignatureNoteValue: song.timeSignatureNoteValue,
    subDivisions: song.subDivisions,
    songLength: song.songLength,
    accents: [...song.accents],
  }
}

export type NewSong = Omit<Song, "id">;

export type SongWithSetlists = Song & {
  setlists?: Setlist[] // TODO
  setlistIds?: string[] // TODO
}

export type Setlist = {
  id: string,
  title: string,
  archived?: boolean,
  songIds: string[],
}

export function toNewSetlist(setlist: Setlist | NewSetlist | SetlistWithSongs): NewSetlist {
  return {
    title: setlist.title,
    archived: setlist.archived,
    songIds: [...setlist.songIds]
  }
}

export type NewSetlist = Omit<Setlist, "id">;

export type SetlistWithSongs = Setlist & {
  songs: Song[] // TODO
}

export type NewSetlistWithSongs = Omit<SetlistWithSongs, "id">;

export type KeyConfig = {
  playKey: string,
  nextSongKey: string,
  previousSongKey: string,
}

export type Config = KeyConfig & {
  noSleepAlways: boolean,
  noSleepWhenStarted: boolean
}

export type ConfigKey = keyof KeyConfig;

export type AppState = {
  song: Song | NewSong,
  setlist?: SetlistWithSongs,
  activeSetlistId?: string, // TODO
  activeSetlistIdx: number,
  config: Config
}

export type AudioData = {
  accentAudioBuffer?: AudioBuffer,
  nonAccentAudioBuffer?: AudioBuffer
}
