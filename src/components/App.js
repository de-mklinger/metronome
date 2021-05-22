import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Metronome from "./metronome/Metronome";
import SongEditorContainer from "./song/SongEditorContainer";
import {useEffect, useState} from "react";
import SetlistsEditor from "./setlist/SetlistsEditor";
import SetlistEditorContainer from "./setlist/SetlistEditorContainer";
import LoadingIndicator from "./LoadingIndicator";
import songRepository from "../lib/songRepository";

function App() {
    const [loadSetlistId, setLoadSetlistId] = useState(null);
    const [setlist, setSetlist] = useState(null);

    const onSetlistChange = changedSetlist => {
        if (setlist && setlist.id === changedSetlist) {
            setSetlist(changedSetlist);
        }
    }

    const onSongChange = changedSong => {
        if (setlist && setlist.songIds.find(songId => songId === changedSong.id)) {
            setLoadSetlistId(setlist.id);
        }
    }

    useEffect(() => {
            if (loadSetlistId !== null) {
                songRepository.getSetlist(loadSetlistId).then(setlist => {
                    setSetlist(setlist);
                    setLoadSetlistId(null);
                });
            }
        },
        [loadSetlistId]
    );

    if (loadSetlistId) {
        return <LoadingIndicator />;
    }

    return (
        <Router>
            <Switch>
                <Route path="/songs/:id">
                    <SongEditorContainer
                        onSongChange={onSongChange}
                    />
                </Route>
                <Route path="/setlists/:id">
                    <SetlistEditorContainer
                        onSetlistChange={onSetlistChange}
                    />
                </Route>
                <Route path="/setlists">
                    <SetlistsEditor
                        activeSetlist={setlist}
                        onSetlistSelect={setSetlist} />
                </Route>
                <Route path="/">
                    <Metronome setlist={setlist}
                               onSetlistSelect={setSetlist}
                    />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
