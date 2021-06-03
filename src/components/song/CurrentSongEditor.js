import SongEditor from "./SongEditor";
import {useState} from "react";
import {Button, Container} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";

function CurrentSongEditor({appState, appStateDispatch}) {

    const [songState, setSongState] = useState(appState.song);
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return <Redirect to="/"/>
    }

    const apply = () => {
        appStateDispatch({type: "setSong", payload: songState});
        setSubmitted(true);
    }

    return (
        <Container className="song-editor-screen">
            <h1>Edit Current Song</h1>

            <SongEditor
                song={{...songState, setlists: null}}
                onChange={setSongState}
            />

            <Button className="btn-primary" onClick={apply}>
                Ok
            </Button>

            <Link to="/" className="btn btn-link">Cancel</Link>
        </Container>
    )
}

export default CurrentSongEditor;