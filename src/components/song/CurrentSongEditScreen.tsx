import SongEditor from "./SongEditor.tsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../../lib/use-app-state.ts";
import { useSaveSong } from "../../lib/repository.ts";
import LoadingIndicator from "../common/LoadingIndicator.tsx";
import Button from "../controls/Button.tsx";
import Screen from "../controls/Screen.tsx";

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
      <h1>Edit Current Song</h1>

      <SongEditor song={songState} onChange={setSongState} />

      <div className="form-group">
        <Button onClick={apply}>
          Ok
        </Button>

        <Button
          variant="secondary"
          onClick={saveAsNew}
          disabled={!songState.title}
        >
          Save as new
        </Button>

        <Link to={back} className="btn btn-link">
          Cancel
        </Link>
      </div>
    </Screen>
  );
}

export default CurrentSongEditScreen;
