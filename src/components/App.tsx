import {HashRouter as Router, Route, Switch} from "react-router-dom";
import {useEffect, useState} from "react";
import LoadingIndicator from "./common/LoadingIndicator.tsx";
import useAppState from "../lib/app-state.ts";
import repository from "../lib/repository.ts";
import {useNoSleep} from "../lib/no-sleep.ts";
import {getAudioContext} from "../lib/audio.js";
import SplashScreen from "./SplashScreen.js";
import {IntlProvider} from "react-intl";
import {SetlistWithSongs, Song} from "../types.ts";
import MetronomeScreen from "./metronome/MetronomeScreen.tsx";
import ConfigEditScreen from "./config/ConfigEditScreen.tsx";
import CurrentSongEditScreen from "./song/CurrentSongEditScreen.tsx";
import SongEditScreen from "./song/SongEditScreen.tsx";
import SetlistEditRoute from "./setlist/SetlistEditRoute.tsx";
import SetlistsEditScreen from "./setlist/SetlistsEditScreen.tsx";
import {language, messages} from "../lang/i18n.ts";

function App() {
    const [loadSetlistId, setLoadSetlistId] = useState<string | undefined>(undefined);

    const [appState, appStateDispatch] = useAppState();

    useEffect(() => {
            repository.getAppState()
                .then(loadedAppState => appStateDispatch({type: "setAppState", payload: loadedAppState}));
        },
        [appStateDispatch] // appStateDispatch stays stable
    );

    useEffect(() => {
            if (loadSetlistId) {
                repository.getSetlist(loadSetlistId).then(setlist => {
                    appStateDispatch({type: "setSetlist", payload: setlist})
                    setLoadSetlistId(undefined);
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

    function onSetlistChange(changedSetlist: SetlistWithSongs) {
        // TODO reload setlist
        //console.log("changed setlist:", changedSetlist);
        if (appState.setlist && appState.setlist.id === changedSetlist.id) {
            appStateDispatch({type: "setSetlist", payload: changedSetlist});
        }
    }

    function onSongChange(changedSong: Song) {
        if (appState.setlist && appState.setlist.songIds.find(songId => songId === changedSong.id)) {
            setLoadSetlistId(appState.setlist.id);
        }
    }

    return (
        <>
            <IntlProvider locale={language} defaultLocale="en" messages={messages[language]}>
                {/*<NoSleepDebugView noSleep={noSleep} />*/}
                <Router>
                    <Switch>
                        <Route path="/config">
                            <ConfigEditScreen
                                appState={appState}
                                appStateDispatch={appStateDispatch}
                            />
                        </Route>
                        <Route path="/currentsong">
                            <CurrentSongEditScreen
                                appState={appState}
                                appStateDispatch={appStateDispatch}
                            />
                        </Route>
                        <Route path="/songs/:id">
                            <SongEditScreen
                                onSongChange={onSongChange}
                                onSetlistChange={onSetlistChange}
                            />
                        </Route>
                        <Route path="/setlists/:id">
                            <SetlistEditRoute
                                onSetlistChange={onSetlistChange}
                            />
                        </Route>
                        <Route path="/setlists">
                            <SetlistsEditScreen
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
            </IntlProvider>
        </>
    );
}

export default App;
