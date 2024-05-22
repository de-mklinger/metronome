import SongEditor from "./SongEditor.tsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../../lib/use-app-state.ts";
import { useSaveSong } from "../../lib/repository.ts";
import LoadingIndicator from "../common/LoadingIndicator.tsx";
import Button from "../controls/Button.tsx";
import Screen from "../controls/Screen.tsx";
import { FormattedMessage } from "react-intl";
import FormButtonsGroup from "../controls/FormButtonsGroup.tsx";

function CurrentSongEditScreen() {
  const appState = useAppState();
  const [songState, setSongState] = useState(appState.song);
  const { invoke: saveSong, inProgress, error } = useSaveSong();

  const navigate = useNavigate();

  if (inProgress) {
    return <LoadingIndicator />;
  }

  if (error) {
    throw error;
  }

  const back = "/";

  const apply = () => {
    appState.song = songState;
    navigate(back);
  };

  function saveAsNew() {
    saveSong(songState).then(() => apply());
  }

  return (
    <Screen name="song-editor" back={back}>
      <h1>
        <FormattedMessage id="song.edit-current" />
      </h1>

      <SongEditor song={songState} onChange={setSongState} />

      <FormButtonsGroup>
        <Button onClick={apply}>
          <FormattedMessage id="ok" />
        </Button>

        <Button
          variant="secondary"
          onClick={saveAsNew}
          disabled={!songState.title}
        >
          <FormattedMessage id="song.save-as-new" />
        </Button>

        <Link to={back} className="btn btn-link">
          <FormattedMessage id="cancel" />
        </Link>
      </FormButtonsGroup>
    </Screen>
  );
}

export default CurrentSongEditScreen;
