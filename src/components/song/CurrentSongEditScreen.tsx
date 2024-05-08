import SongEditor from "./SongEditor.tsx";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../../lib/use-app-state.ts";
import { useSaveSong } from "../../lib/repository.ts";
import LoadingIndicator from "../common/LoadingIndicator.tsx";

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

  const apply = () => {
    appState.song = songState;
    navigate(-1);
  };

  function saveAsNew() {
    saveSong(songState).then(() => apply());
  }

  return (
    <Container className="song-editor-screen">
      <h1>Edit Current Song</h1>

      <SongEditor song={songState} onChange={setSongState} />

      <div className="form-group">
        <Button className="btn-primary" onClick={apply}>
          Ok
        </Button>

        <Button
          className="btn-secondary"
          onClick={saveAsNew}
          disabled={!songState.title}
        >
          Save as new
        </Button>

        <Link to="/" className="btn btn-link">
          Cancel
        </Link>
      </div>
    </Container>
  );
}

export default CurrentSongEditScreen;
