import SongsList, { SongsListProps } from "./SongsList.tsx";
import { useState } from "react";
import { useIntl } from "react-intl";

export type FilteredSongsListProps = SongsListProps;

export default function FilteredSongsList({songs, ...rest}: FilteredSongsListProps) {
  const [filter, setFilter] = useState("");

  const intl = useIntl();
  const filterPlaceholder = intl.formatMessage({ id: "songs.filter" });

  let filteredSongs = songs;
  if (filter) {
    filteredSongs = songs.filter((song) =>
      song.title.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  return (
    <>
      <div className="form-group">
        <input
          type="search"
          className="form-control"
          placeholder={filterPlaceholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <SongsList songs={filteredSongs} {...rest} />
    </>
  )
}
