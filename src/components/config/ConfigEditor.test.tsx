import {findByRole, fireEvent, render, screen} from '@testing-library/react';
import ConfigEditor from "./ConfigEditor.js";
import {HashRouter, Route} from "react-router-dom";
import {defaultConfig, defaultSong} from "../../lib/env.js";
import {expect, test} from "vitest"
import {AppState, Config} from "../../types.ts";
import {IntlProvider} from "react-intl";
import {messages} from "../../lang/i18n.ts";

test('renders shortcut settings', async () => {
  renderConfigEditor();

  screen.getByText(/Start\/Stop/i);
  expect(screen.getByTestId("key-input-playKey"))
    .toHaveTextContent("<Space>");

  screen.getByText(/Next Song/i);
  expect(screen.getByTestId("key-input-nextSongKey"))
    .toHaveTextContent("<Right>");

  screen.getByText(/Previous Song/i);
  expect(screen.getByTestId("key-input-previousSongKey"))
    .toHaveTextContent("<Left>");
});

test('renders customized shortcut settings', async () => {
  renderConfigEditor({playKey: "ArrowUp"});

  expect(screen.getByTestId("key-input-playKey"))
    .toHaveTextContent("<Up>");
});

test('saves shortcut settings', async () => {
  const newKey = "x";

  const dispatched = renderConfigEditor();

  const changeButtonBefore = await findButton("key-input-playKey");
  expect(changeButtonBefore)
    .toHaveTextContent("Change...");

  fireEvent.click(changeButtonBefore);

  expect(await findButton("key-input-playKey"))
    .toHaveTextContent("Press Button to change");

  fireEvent.keyDown(window, {key: newKey})

  expect(await findButton("key-input-playKey"))
    .toHaveTextContent("Change...");

  fireEvent.click(await screen.findByText("Save"));

  expect(dispatched).toHaveLength(1);
  expect(dispatched[0]).toHaveProperty("type", "setConfig");
  expect(dispatched[0]).toHaveProperty("payload.playKey", newKey);
});

function renderConfigEditor(configOverrides?: Partial<Config>) {
  const dispatched: unknown[] = [];
  const config = {
    ...defaultConfig,
    ...configOverrides
  }
  const appState: AppState = {
    config,
    song: defaultSong,
    activeSetlistIdx: 0
  };
  const appStateDispatch = (x: unknown) => dispatched.push(x);

  render(
    <IntlProvider locale="en" defaultLocale="en" messages={messages["en"]}>
        <HashRouter>
          <Route>
            <ConfigEditor
              appState={appState}
              appStateDispatch={appStateDispatch}/>
          </Route>
        </HashRouter>
    </IntlProvider>
  );

  return dispatched;
}

async function findButton(containerTestId: string) {
  return findByRole(
    await screen.findByTestId(containerTestId),
    "button"
  );
}
