import { HashRouter as Router, Outlet, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import LoadingIndicator from "./common/LoadingIndicator.tsx";
import { AppStateContextProvider } from "../lib/app-state.tsx";
import { useNoSleep } from "../lib/no-sleep.ts";
import { IntlProvider } from "react-intl";
import MetronomeScreen from "./metronome/MetronomeScreen.tsx";
import ConfigEditScreen from "./config/ConfigEditScreen.tsx";
import CurrentSongEditScreen from "./song/CurrentSongEditScreen.tsx";
import { language, messages } from "../lang/i18n.ts";
import { useAppState } from "../lib/use-app-state.ts";
import SetlistsScreen from "./setlist/SetlistsScreen.tsx";
import SetlistEditScreen from "./setlist/SetlistEditScreen.tsx";

function App() {
  // const [loadSetlistId, setLoadSetlistId] = useState<string | undefined>(
  //   undefined,
  // );

  // const [appState, appStateDispatch] = useAppState();

  // useEffect(
  //   () => {
  //     repository
  //       .getAppState()
  //       .then((loadedAppState) =>
  //         appStateDispatch({ type: "setAppState", payload: loadedAppState }),
  //       );
  //   },
  //   [appStateDispatch], // appStateDispatch stays stable
  // );
  //
  // useEffect(() => {
  //   if (loadSetlistId) {
  //     repository.getSetlist(loadSetlistId).then((setlist) => {
  //       appStateDispatch({ type: "setSetlist", payload: setlist });
  //       setLoadSetlistId(undefined);
  //     });
  //   }
  // }, [loadSetlistId, appStateDispatch]);

  // const isAudioContextRunning = () => getAudioContext().state === "running";
  // const isNoSleepEnabled = () => noSleep.current && noSleep.current.isEnabled();
  // const [showSplashScreen, setShowSplashScreen] = useState(
  //   !isAudioContextRunning() ||
  //     (appState && appState.config.noSleepAlways && !isNoSleepEnabled()),
  // );
  //
  // if (!appState || loadSetlistId) {
  //   return <LoadingIndicator />;
  // }
  //
  // if (showSplashScreen) {
  //   return <SplashScreen onClick={() => setShowSplashScreen(false)} />;
  // }

  // function onSetlistChange(changedSetlist: SetlistWithSongs) {
  //   // TODO reload setlist
  //   //console.log("changed setlist:", changedSetlist);
  //   if (appState.setlist && appState.setlist.id === changedSetlist.id) {
  //     appState.setlist = changedSetlist;
  //   }
  // }
  //
  // function onSongChange(changedSong: Song) {
  //   if (
  //     appState.setlist &&
  //     appState.setlist.songIds.find((songId) => songId === changedSong.id)
  //   ) {
  //     setLoadSetlistId(appState.setlist.id);
  //   }
  // }

  return (
    <>
      <AppStateContextProvider>
        <NoSleepAlwaysIfEnabled />
        <IntlProvider
          locale={language}
          defaultLocale="en"
          messages={messages[language]}
        >
          {/*<NoSleepDebugView noSleep={noSleep} />*/}
          <Suspense fallback={<LoadingIndicator />}>
            <Router>
              <Routes>
                <Route element={<EditLayout />}>
                  <Route path="config" element={<ConfigEditScreen />} />
                  <Route
                    path="currentsong"
                    element={<CurrentSongEditScreen />}
                  />
                  <Route path="songs" element={<>TODO</>} />
                  {/*<Route*/}
                  {/*  path="songs/:id"*/}
                  {/*  element={*/}
                  {/*    <SongEditScreen*/}
                  {/*      onSongChange={onSongChange}*/}
                  {/*      onSetlistChange={onSetlistChange}*/}
                  {/*    />*/}
                  {/*  }*/}
                  {/*/>*/}
                  <Route path="setlists" element={<SetlistsScreen />} />
                  <Route path="setlists/:id" element={<SetlistEditScreen />} />
                </Route>
                <Route element={<MetronomeLayout />}>
                  <Route index={true} element={<MetronomeScreen />} />
                </Route>
              </Routes>
            </Router>
          </Suspense>
        </IntlProvider>
      </AppStateContextProvider>
    </>
  );
}

function NoSleepAlwaysIfEnabled() {
  const appState = useAppState();
  useNoSleep(appState.config.noSleepAlways);
  return (
    <></>
  )
}

function EditLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function MetronomeLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
