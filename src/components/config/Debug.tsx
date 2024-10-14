import { consoleMessages } from "../../lib/console-messages.ts";
import FormGroup from "../controls/FormGroup.tsx";
import { useAppState } from "../../lib/use-app-state.ts";
import { ChangeEvent } from "react";

export default function Debug() {
  const appState = useAppState();

  function handleDebugChange(e: ChangeEvent<HTMLSelectElement>) {
    const debug = e.target.value === "true";
    console.log("Switching debug to", debug);
    appState.config = {
      ...appState.config,
      debug,
    };
  }

  return (
    <>
      <h2>
        Debug
        {/*<FormattedMessage id="config.debug" />*/}
      </h2>

      <FormGroup>
        <label htmlFor="debug-select">
          Enabled
          {/*<FormattedMessage id="config.debug.enabled" />*/}
        </label>
        <select
          className="form-control"
          value={(appState.config.debug ?? false).toString()}
          onChange={handleDebugChange}
          id="debug-select"
        >
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </FormGroup>

      {consoleMessages.map((m, idx) => (
        <div key={idx + m.timestamp.getDate()}>
          <div style={{ opacity: ".5" }}>
            <span style={{ display: "inline-block", width: "3.5rem" }}>
              {m.severity}
            </span>
            {m.timestamp.toISOString()}
          </div>
          <div>{m.message}</div>
        </div>
      ))}
    </>
  );
}
