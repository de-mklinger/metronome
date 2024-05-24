import { useGetSongs } from "../../lib/repository.ts";
import LoadingIndicator from "../common/LoadingIndicator.tsx";
import { Song } from "../../types.ts";
import FilteredSongsList from "./FilteredSongsList.tsx";

export type LoadingSongsListProps = {
  onEdit?: (song: Song) => void;
  onSelect?: (song: Song) => void;
};

export default function LoadingSongsList({onEdit, onSelect}: LoadingSongsListProps) {
  const {
    invoke: getSongs,
    inProgress: getSongsInProgress,
    error,
    result: songs,
  } = useGetSongs();

  if (!getSongsInProgress && !songs) {
    getSongs();
    return <LoadingIndicator />;
  }

  if (getSongsInProgress || !songs) {
    return <LoadingIndicator />;
  }

  if (error) {
    throw error;
  }

  return <FilteredSongsList songs={songs} onEdit={onEdit} onSelect={onSelect} />;
}
