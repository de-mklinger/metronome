import { HashRouter as Router, Outlet, Route, Routes } from "react-router-dom";
import { PropsWithChildren, Suspense } from "react";
import LoadingIndicator from "./common/LoadingIndicator.tsx";
import { AppStateContextProvider } from "../lib/app-state.tsx";
import { useNoSleep } from "../lib/no-sleep.ts";
import { IntlProvider } from "react-intl";
import MetronomeScreen from "./metronome/MetronomeScreen.tsx";
import ConfigEditScreen from "./config/ConfigEditScreen.tsx";
import CurrentSongEditScreen from "./song/CurrentSongEditScreen.tsx";
import { messages } from "../lang/i18n.ts";
import { useAppState } from "../lib/use-app-state.ts";
import SetlistsScreen from "./setlist/SetlistsScreen.tsx";
import SetlistEditScreen from "./setlist/SetlistEditScreen.tsx";
import SplashScreen from "./SplashScreen.tsx";
import { loadAppState } from "../lib/app-state-storage.ts";
import SongsScreen from "./song/SongsScreen.tsx";
import NotFoundScreen from "./NotFoundScreen.tsx";
import SongEditScreen from "./song/SongEditScreen.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorScreen from "./ErrorScreen.tsx";

export default function App() {
  const initialAppState = loadAppState();

  return (
    <>
      <ErrorBoundary fallback={<ErrorScreen />}>
        <AppStateContextProvider initialAppState={initialAppState}>
          <NoSleepAlwaysIfEnabled />
          <CustomIntlProvider>
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
                      <Route path="songs" element={<SongsScreen />} />
                      <Route path="songs/:id" element={<SongEditScreen />} />
                      <Route path="setlists" element={<SetlistsScreen />} />
                      <Route
                        path="setlists/:id"
                        element={<SetlistEditScreen />}
                      />
                      <Route path="*" element={<NotFoundScreen />} />
                    </Route>
                    <Route element={<MetronomeLayout />}>
                      <Route index={true} element={<MetronomeScreen />} />
                    </Route>
                  </Routes>
                </Router>
              </SplashScreen>
            </Suspense>
          </CustomIntlProvider>
        </AppStateContextProvider>
      </ErrorBoundary>
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

function CustomIntlProvider({ children }: PropsWithChildren) {
  const locale = useLocale();

  return (
    <IntlProvider
      locale={locale}
      defaultLocale="en"
      messages={messages[locale]}
    >
      {children}
    </IntlProvider>
  );
}

function useLocale(): SupportedLocale {
  const appState = useAppState();

  if (isSupportedLocale(appState.config.locale)) {
    console.log(
      "Found supported locale in app state config:",
      appState.config.locale,
    );
    return appState.config.locale;
  } else {
    console.log(
      "No supported locale found in app state config:",
      appState.config.locale,
    );
    return getBrowserDefaultLocale();
  }
}

type SupportedLocale = keyof typeof messages;

function isSupportedLocale(x: unknown): x is SupportedLocale {
  return typeof x === "string" && x in messages;
}

function getBrowserDefaultLocale(): SupportedLocale {
  let browserDefaultLocale: SupportedLocale = "en";

  const navigatorLanguage = navigator.language.toLowerCase();
  if (navigatorLanguage === "de" || navigatorLanguage.startsWith("de-")) {
    browserDefaultLocale = "de";
  }

  console.log("Using browser locale:", browserDefaultLocale);

  return browserDefaultLocale;
}
