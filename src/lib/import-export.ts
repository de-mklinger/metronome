import { isSetlist, isSong, Setlist, Song } from "../types.ts";
import repository from "./repository.ts";
import { setlistWithoutSongs } from "./baseRepository.ts";
import isPlainOldObject from "./is-plain-old-object.ts";

export type ImportExportData = {
  type: "metronome-data";
  version: 1;
  songs: Song[];
  setlists: Setlist[];
};

export function isImportExportData(x: unknown): x is ImportExportData {
  return (
    isPlainOldObject(x) &&
    x.type === "metronome-data" &&
    x.version === 1 &&
    Array.isArray(x.songs) &&
    !x.songs.find((s) => !isSong(s)) &&
    Array.isArray(x.setlists) &&
    !x.setlists.find((s) => !isSetlist(s))
  );
}

export async function createExportObject(): Promise<ImportExportData> {
  const [songs, setlists] = await Promise.all([
    repository.getSongs(),
    repository.getSetlists(),
  ]);

  return {
    type: "metronome-data",
    version: 1,
    songs,
    setlists: setlists.map(setlistWithoutSongs),
  };
}

export type ImportPreparation = {
  data?: ImportExportData;
  comments: string[];
};

export async function prepareImport(json: string): Promise<ImportPreparation> {
  const comments = [];

  let data;
  try {
    data = JSON.parse(json);
  } catch (e) {
    comments.push(`Parsing JSON failed: ${e}`);
  }

  if (!isImportExportData(data)) {
    data = undefined;
    comments.push("Type check failed");
  } else {
    const [existingSetlists, existingSongs] = await Promise.all([
      repository.getSetlists(),
      repository.getSongs(),
    ]);

    comments.push(`Importing ${data.songs.length} songs`);

    const songsToOverwrite = data.songs.filter((s) =>
      Boolean(existingSongs.find((ss) => ss.id === s.id)),
    ).length;
    if (songsToOverwrite > 0) {
      comments.push(`Overwriting ${songsToOverwrite} songs`);
    }

    comments.push(`Importing ${data.setlists.length} setlists`);

    const setlistsToOverwrite = data.setlists.filter((s) =>
      Boolean(existingSetlists.find((ss) => ss.id === s.id)),
    ).length;
    if (setlistsToOverwrite > 0) {
      comments.push(`Overwriting ${setlistsToOverwrite} songs`);
    }
  }

  return {
    data,
    comments,
  };
}

export async function doImport(importExportData: ImportExportData) {
  for (const song of importExportData.songs) {
    await repository.saveSong(song);
  }

  for (const setlist of importExportData.setlists) {
    await repository.saveSetlist(setlist);
  }
}
