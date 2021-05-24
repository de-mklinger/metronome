import {useEffect, useState} from "react";
import LoadingIndicator from "../LoadingIndicator";
import songRepository from "../../lib/songRepository";
import {Container} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";

function SetlistsEditor({appState, appStateDispatch}) {
    const [setlists, setSetlists] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        songRepository.getSetlists().then(setSetlists);
    }, []);

    if (redirect) {
        return <Redirect to="/" />
    }

    if (setlists === null) {
        return <LoadingIndicator />;
    }

    return (
        <Container className="setlists-editor-screen">
            <h1>Setlists</h1>
            <div className="setlists">
                <ul>
                    {setlists.map(setlist =>
                        <li key={setlist.id}
                            className={appState.setlist && appState.setlist.id === setlist.id ? "active": ""}>
                            <div>
                                <div>
                                    {setlist.title}
                                </div>
                                <div>
                                    {setlist.songs.length} songs
                                </div>
                            </div>
                            <div>
                                <Link className="btn btn-primary"
                                    to={"/setlists/" + encodeURIComponent(setlist.id)}>
                                    Edit
                                </Link>
                                <button className="btn btn-primary" onClick={() => {
                                    appStateDispatch({type: "setSetlist", payload: setlist})
                                    setRedirect(true);
                                }}>
                                    Select
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>

            <Link to="/" className="btn btn-link">Cancel</Link>
        </Container>
    );
}

export default SetlistsEditor;