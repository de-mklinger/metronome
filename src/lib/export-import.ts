import {isSetlist, isSong, Setlist, Song} from "../types.ts";
import repository from "./repository.ts";
import {setlistWithoutSongs} from "./baseRepository.ts";
import isPlainOldObject from "./is-plain-old-object.ts";

export type ExportImportData = {
  type: "metronome-data",
  version: 1,
  songs: Song[];
  setlists: Setlist[];
};

export function isExportImportData(x: unknown): x is ExportImportData {
  return isPlainOldObject(x) &&
    x.type === "metronome-data" &&
    x.version === 1 &&
    Array.isArray(x.songs) &&
    !x.songs.find(s => !isSong(s)) &&
    Array.isArray(x.setlists) &&
    !x.setlists.find(s => !isSetlist(s));
}

export async function createExportObject(): Promise<ExportImportData> {
  const [songs, setlists] = await Promise.all([
    repository.getSongs(),
    repository.getSetlists(),
  ]);

  return {
    type: "metronome-data",
    version: 1,
    songs,
    setlists: setlists.map(setlistWithoutSongs)
  };
}

export async function prepareImport(data: ExportImportData): Promise<string[]> {
  const result = [];

  if (!isExportImportData(data)) {
    result.push("Type check failed");
  } else {
    result.push(`Importing ${data.songs.length} songs`);
    result.push(`Importing ${data.setlists.length} setlists`);
  }

  return result;
}