import {HashRouter as Router, Route, Switch} from "react-router-dom";
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
import {getAudioContext} from "../lib/audio";
import SplashScreen from "./SplashScreen";
import MetronomeScreen from "./metronome/MetronomeScreen";

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

    const noSleep = useNoSleep(appState != null && appState.config.noSleepAlways);

    const isAudioContextRunning = () => getAudioContext().state === "running";
    const isNoSleepEnabled = () => noSleep.current && noSleep.current.isEnabled();
    const [showSplashScreen, setShowSplashScreen] = useState(
        !isAudioContextRunning()
        || (appState && appState.config.noSleepAlways && !isNoSleepEnabled())
    );

    if (!appState || loadSetlistId) {
        return <LoadingIndicator/>;
    }

    if (showSplashScreen) {
        return <SplashScreen onClick={() => setShowSplashScreen(false)}/>
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
                        <MetronomeScreen
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
