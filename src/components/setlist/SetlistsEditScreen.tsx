import {useState} from "react";
import LoadingIndicator from "../common/LoadingIndicator.tsx";
import {Button, Container} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import SetlistEditScreen from "./SetlistEditScreen.tsx";
import {useGetSetlists, useSaveSetlist} from "../../lib/repository.js";
import {AppStateProps} from "../../lib/app-state.tsx";

function SetlistsEditScreen({appState, appStateDispatch}: AppStateProps) {
    const {invoke: getSetlists, inProgress: getSetlistsInProgress, error: getSetlistsError, result: setlists, reset: resetSetlists} = useGetSetlists();
    const {invoke: saveSetlist, inProgress: saveSetlistInProgress, error: saveSetlistError} = useSaveSetlist();
    const [redirect, setRedirect] = useState(false);
    const [newSetlist, setNewSetlist] = useState(false);

    const navigate = useNavigate();

    if (redirect) {
        navigate(-1);
    }

    if (!getSetlistsInProgress && !setlists) {
      getSetlists();
    }

    if (getSetlistsInProgress || saveSetlistInProgress || !setlists) {
        return <LoadingIndicator />;
    }

    const error = getSetlistsError ?? saveSetlistError;
    if (error) {
      throw error;
    }

    if (newSetlist) {
        return (
            <SetlistEditScreen
                onSetlistChange={setlist => {
                    saveSetlist(setlist)
                      .then(() => resetSetlists())
                      .then(() => setNewSetlist(false));
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
                                    <div className="title small">
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

export default SetlistsEditScreen;
