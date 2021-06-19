import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Metronome from "./metronome/Metronome";
import SongEditorContainer from "./song/SongEditorContainer";
import {useEffect, useState} from "react";
import SetlistsEditor from "./setlist/SetlistsEditor";
import LoadingIndicator from "./LoadingIndicator";
import useAppState from "./app-state";
import CurrentSongEditor from "./song/CurrentSongEditor";
import SetlistEditorRoute from "./setlist/SetlistEditorRoute";
import repository from "../lib/repository";
import ConfigEditor from "./config/ConfigEditor";
import {useNoSleep} from "../lib/no-sleep";

function App() {
    const [loadSetlistId, setLoadSetlistId] = useState(null);

    const [appState, appStateDispatch] = useAppState();

    useEffect(() => {
            repository.getAppState()
                .then(loadedAppState => appStateDispatch({type: "setAppState", payload: loadedAppState}));
        },
        [appStateDispatch] // appStateDispatch stays stable
    );

    useEffect(() => {
            if (loadSetlistId !== null) {
                repository.getSetlist(loadSetlistId).then(setlist => {
                    appStateDispatch({type: "setSetlist", payload: setlist})
                    setLoadSetlistId(null);
                });
            }
        },
        [loadSetlistId, appStateDispatch]
    );

    useNoSleep(appState != null && appState.config.noSleepAlways);

    if (appState === null || loadSetlistId) {
        return <LoadingIndicator/>;
    }

    const onSetlistChange = changedSetlist => {
        // TODO reload setlist
        //console.log("changed setlist:", changedSetlist);
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
        <>
            {/*<NoSleepDebugView noSleep={noSleep} />*/}
            <Router>
                <Switch>
                    <Route path="/config">
                        <ConfigEditor
                            appState={appState}
                            appStateDispatch={appStateDispatch}
                        />
                    </Route>
                    <Route path="/currentsong">
                        <CurrentSongEditor
                            appState={appState}
                            appStateDispatch={appStateDispatch}
                        />
                    </Route>
                    <Route path="/songs/:id">
                        <SongEditorContainer
                            onSongChange={onSongChange}
                            onSetlistChange={onSetlistChange}
                        />
                    </Route>
                    <Route path="/setlists/:id">
                        <SetlistEditorRoute
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
        </>
    );
}

export default App;
