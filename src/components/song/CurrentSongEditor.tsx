import SongEditor from "./SongEditor.tsx";
import {useState} from "react";
import {Button, Container} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";
import {AppStateProps} from "../../lib/app-state.ts";
import {useSaveSong} from "../../lib/repository.ts";
import LoadingIndicator from "../common/LoadingIndicator.tsx";

function CurrentSongEditor({appState, appStateDispatch}: AppStateProps) {
    const [songState, setSongState] = useState(appState.song);
    const [submitted, setSubmitted] = useState(false);
    const {invoke: saveSong, inProgress, error} = useSaveSong();

    if (submitted) {
        return <Redirect to="/"/>
    }

    if (inProgress) {
      return <LoadingIndicator />
    }

    if (error) {
      throw error;
    }

    const apply = () => {
        appStateDispatch({type: "setSong", payload: songState});
        setSubmitted(true);
    }

    function saveAsNew() {
      saveSong(songState)
        .then(() => apply())
    }

    return (
        <Container className="song-editor-screen">
            <h1>Edit Current Song</h1>

            <SongEditor
                song={songState}
                onChange={setSongState}
            />

            <div className="form-group">
                <Button className="btn-primary" onClick={apply}>
                    Ok
                </Button>

                <Button className="btn-secondary" onClick={saveAsNew} disabled={!songState.title}>
                    Save as new
                </Button>

                <Link to="/" className="btn btn-link">Cancel</Link>
            </div>
        </Container>
    )
}

export default CurrentSongEditor;
