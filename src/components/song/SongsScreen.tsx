import { Song } from "../../types.ts";
import { useAppState } from "../../lib/use-app-state.ts";
import { useNavigate } from "react-router-dom";
import Screen from "../controls/Screen.tsx";
import LoadingSongsList from "./LoadingSongsList.tsx";
import {FormattedMessage} from "react-intl";

export default function SongsScreen() {
  const appState = useAppState();

  const back = "/";
  const navigate = useNavigate();

  function handleSelect(song: Song) {
    appState.song = song;
    navigate(back);
  }

  function handleEdit(song: Song) {
    navigate("/songs/" + encodeURIComponent(song.id));
  }

  return (
    <Screen name="songs">
      <h1>
        <FormattedMessage id="songs" />
      </h1>
      <LoadingSongsList onSelect={handleSelect} onEdit={handleEdit} />
    </Screen>
  );
}
