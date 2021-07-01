import {findByRole, fireEvent, render, screen} from '@testing-library/react';
import ConfigEditor from "./ConfigEditor";
import {HashRouter, Route} from "react-router-dom";
import {defaultConfig} from "../../lib/env";

test('renders shortcut settings', async () => {
    renderConfigEditor();

    screen.getByText(/Start\/Stop/i);
    expect(screen.getByTestId("key-input-playKey"))
        .toHaveTextContent("<Space>");

    screen.getByText(/Next Song/i);
    expect(screen.getByTestId("key-input-nextSongKey"))
        .toHaveTextContent("<ArrowRight>");

    screen.getByText(/Previous Song/i);
    expect(screen.getByTestId("key-input-previousSongKey"))
        .toHaveTextContent("<ArrowLeft>");
});

test('renders customized shortcut settings', async () => {
    renderConfigEditor({playKey: "ArrowUp"});

    expect(screen.getByTestId("key-input-playKey"))
        .toHaveTextContent("<ArrowUp>");
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

function renderConfigEditor(config = defaultConfig) {
    const dispatched = [];
    const appState = {
        config
    };
    const appStateDispatch = x => dispatched.push(x);

    render(
        <HashRouter>
            <Route>
                <ConfigEditor
                    appState={appState}
                    appStateDispatch={appStateDispatch}/>
            </Route>
        </HashRouter>
    );

    return dispatched;
}

async function findButton(containerTestId) {
    return findByRole(
        await screen.findByTestId(containerTestId),
        "button"
    );
}