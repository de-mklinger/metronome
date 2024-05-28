import { FormattedMessage } from "react-intl";
import FormGroup from "../controls/FormGroup.tsx";
import { useAppState } from "../../lib/use-app-state.ts";
import { ChangeEvent } from "react";

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
    </>
  );
}
