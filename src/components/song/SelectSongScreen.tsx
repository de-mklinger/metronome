import { useState } from "react";
import LoadingIndicator from "../common/LoadingIndicator.tsx";
import SongsList from "./SongsList.tsx";
import { useGetSongs } from "../../lib/repository.ts";
import { Song } from "../../types.ts";
import Screen from "../controls/Screen.tsx";
import CancelButton from "../controls/CancelButton.tsx";
import { FormattedMessage, useIntl } from "react-intl";

export type SelectSongScreenProps = {
  onSelect: (song: Song) => void;
  back?: string | number | (() => void);
};

export default function SelectSongScreen({
  onSelect,
  back,
}: SelectSongScreenProps) {
  const {
    invoke: getSongs,
    inProgress,
    error,
    result: songs,
  } = useGetSongs();

  const [filter, setFilter] = useState("");

  const intl = useIntl();
  const filterPlaceholder = intl.formatMessage({ id: "songs.filter" });

  if (!inProgress && !songs) {
    getSongs();
  }

  if (inProgress || !songs) {
    return <LoadingIndicator />;
  }

  if (error) {
    throw error;
  }

  let filteredSongs = songs;
  if (filter) {
    filteredSongs = songs.filter((song) =>
      song.title.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  return (
    <Screen name="select-song" back={back}>
      <h1>
        <FormattedMessage id="songs.select-song" />
      </h1>

      <div className="form-group">
        <input
          type="search"
          className="form-control"
          placeholder={filterPlaceholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <SongsList songs={filteredSongs} onSelect={onSelect} />

      <div className="form-group">
        <CancelButton back={back} />
      </div>
    </Screen>
  );
}
