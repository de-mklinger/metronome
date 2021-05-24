import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Metronome from "./metronome/Metronome";
import SongEditorContainer from "./song/SongEditorContainer";
import {useEffect, useState} from "react";
import SetlistsEditor from "./setlist/SetlistsEditor";
import SetlistEditorContainer from "./setlist/SetlistEditorContainer";
import LoadingIndicator from "./LoadingIndicator";
import songRepository from "../lib/songRepository";
import useAppState from "./app-state";
import SongEditor from "./song/SongEditor";


function App() {
    const [loadSetlistId, setLoadSetlistId] = useState(null);

    const [appState, appStateDispatch] = useAppState();

    useEffect(() => {
            if (loadSetlistId !== null) {
                songRepository.getSetlist(loadSetlistId).then(setlist => {
                    appStateDispatch({type: "setSetlist", payload: setlist})
                    setLoadSetlistId(null);
                });
            }
        },
        [loadSetlistId, appStateDispatch]
    );

    if (loadSetlistId) {
        return <LoadingIndicator />;
    }

    const onSetlistChange = changedSetlist => {
        if (appState.setlist && appState.setlist.id === changedSetlist) {
            appStateDispatch({type: "setSetlist", payload: changedSetlist});
        }
    }

    const onSongChange = changedSong => {
        if (appState.setlist && appState.setlist.songIds.find(songId => songId === changedSong.id)) {
            setLoadSetlistId(appState.setlist.id);
        }
    }

    return (
        <Router>
            <Switch>
                <Route path="/currentsong">
                    <SongEditor
                        song={appState.song}
                    />
                </Route>
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
                        appState={appState}
                        appStateDispatch={appStateDispatch}
                    />
                </Route>
                <Route path="/">
                    <Metronome
                        appState={appState}
                        appStateDispatch={appStateDispatch}
                    />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
