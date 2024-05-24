import { Song } from "../../types.ts";
import { useAppState } from "../../lib/use-app-state.ts";
import { Link, useNavigate } from "react-router-dom";
import Screen from "../controls/Screen.tsx";
import LoadingSongsList from "./LoadingSongsList.tsx";
import { FormattedMessage } from "react-intl";
import FormButtonsGroup from "../controls/FormButtonsGroup.tsx";
import CancelButton from "../controls/CancelButton.tsx";

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

      <FormButtonsGroup>
        <Link className="btn btn-secondary" to="/songs/_new_">
          <FormattedMessage id="song.new" />
        </Link>
        <CancelButton back={back} />
      </FormButtonsGroup>
    </Screen>
  );
}
