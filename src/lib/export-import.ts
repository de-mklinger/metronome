import { Setlist, Song } from "../types.ts";
import repository from "./repository.ts";
import {setlistWithoutSongs} from "./baseRepository.ts";

export type ExportImportData = {
  type: "metronome-data",
  version: 1,
  songs: Song[];
  setlists: Setlist[];
};

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
