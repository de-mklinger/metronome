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
import SplashScreen from "./SplashScreen.tsx";

export default function App() {
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
            <SplashScreen>
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
                    <Route
                      path="setlists/:id"
                      element={<SetlistEditScreen />}
                    />
                  </Route>
                  <Route element={<MetronomeLayout />}>
                    <Route index={true} element={<MetronomeScreen />} />
                  </Route>
                </Routes>
              </Router>
            </SplashScreen>
          </Suspense>
        </IntlProvider>
      </AppStateContextProvider>
    </>
  );
}

function NoSleepAlwaysIfEnabled() {
  const appState = useAppState();
  useNoSleep(appState.config.noSleepAlways);
  return undefined;
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
