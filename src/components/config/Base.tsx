import { FormattedMessage } from "react-intl";
import FormGroup from "../controls/FormGroup.tsx";
import { useAppState } from "../../lib/use-app-state.ts";
import { ChangeEvent } from "react";
import {
  isNoSleepMode,
  nativeWakeLockSupported,
} from "../../lib/no-sleep-patched.ts";

export default function Base() {
  const appState = useAppState();

  function handleLanguageChange(e: ChangeEvent<HTMLSelectElement>) {
    const locale = e.target.value ?? undefined;
    console.log("Switching locale to", locale);
    appState.config = {
      ...appState.config,
      locale,
    };
  }

  function handleNoSleepModeChange(e: ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    let noSleepMode = isNoSleepMode(v) ? v : undefined;
    if (noSleepMode === "auto") {
      noSleepMode = undefined;
    }

    console.log("Switching noSleepMode to", noSleepMode);
    appState.config = {
      ...appState.config,
      noSleepMode,
    };
  }

  return (
    <>
      <h2>
        <FormattedMessage id="config.base" />
      </h2>

      <FormGroup>
        <label htmlFor="language-select">
          <FormattedMessage id="config.language" />
        </label>
        <select
          className="form-control"
          value={appState.config.locale}
          onChange={handleLanguageChange}
          id="language-select"
        >
          <option value="">
            <FormattedMessage id="config.browser-language" />
          </option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </FormGroup>

      <FormGroup>
        <label htmlFor="wakelock-mode-select">
          <FormattedMessage id="config.noSleepMode" />
        </label>
        <select
          className="form-control"
          value={appState.config.noSleepMode ?? "auto"}
          onChange={handleNoSleepModeChange}
          id="no-sleep-mode-select"
        >
          <option value="auto">
            <FormattedMessage id="config.noSleepMode.auto" />
          </option>
          {nativeWakeLockSupported() && (
            <option value="native">
              <FormattedMessage id="config.noSleepMode.native" />
            </option>
          )}
          <option value="video">
            <FormattedMessage id="config.noSleepMode.video" />
          </option>
        </select>
      </FormGroup>
    </>
  );
}
