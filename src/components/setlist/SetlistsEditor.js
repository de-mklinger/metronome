import {useEffect, useState} from "react";
import LoadingIndicator from "../LoadingIndicator";
import songRepository from "../../lib/songRepository";
import {Button, Container} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";
import SetlistEditorContainer from "./SetlistEditorContainer";

function SetlistsEditor({appState, appStateDispatch}) {
    const [setlists, setSetlists] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [newSetlist, setNewSetlist] = useState(false);

    useEffect(() => {
        songRepository.getSetlists().then(setSetlists);
    }, []);

    if (redirect) {
        return <Redirect to="/" />
    }

    if (setlists === null) {
        return <LoadingIndicator />;
    }

    if (newSetlist) {
        return (
            <SetlistEditorContainer
                onSetlistChange={setlist => {
                    setSetlists([...setlists, setlist]);
                    setNewSetlist(false);
                }}
                onCancel={() => setNewSetlist(false)}
            />
        );
    }

    return (
        <Container className="setlists-editor-screen">
            <h1>Setlists</h1>

            {setlists && setlists.length > 0 &&
                <div className="setlists form-group">
                    <ul>
                        {setlists.map(setlist =>
                            <li key={setlist.id}
                                className={appState.setlist && appState.setlist.id === setlist.id ? "active": ""}>
                                <div className="title">
                                    <div className="title">
                                        {setlist.title}
                                    </div>
                                    <div className="title">
                                        {setlist.songs.length} songs
                                    </div>
                                </div>
                                <div className="actions">
                                    <Link className="btn btn-secondary"
                                        to={"/setlists/" + encodeURIComponent(setlist.id)}>
                                        Edit
                                    </Link>
                                    <Button variant="secondary" onClick={() => {
                                        appStateDispatch({type: "setSetlist", payload: setlist})
                                        setRedirect(true);
                                    }}>
                                        Select
                                    </Button>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            }

            <div className="form-group">
                <Button variant="secondary" onClick={() => setNewSetlist(true)}>
                    New Setlist...
                </Button>
            </div>

            <div className="form-group">
                <Link to="/" className="btn btn-link">
                    Cancel
                </Link>
            </div>
        </Container>
    );
}

export default SetlistsEditor;