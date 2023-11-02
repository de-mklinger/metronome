import Metronome from "./Metronome.js";
import Div100vh from "react-div-100vh";
import {AppStateProps} from "../../lib/app-state.ts";

export type MetronomeScreenProps = AppStateProps;

function MetronomeScreen({appState, appStateDispatch}: MetronomeScreenProps) {
    return (
        <Div100vh className="metronome-screen">
            <Metronome appState={appState} appStateDispatch={appStateDispatch} />
        </Div100vh>
    )
}

export default MetronomeScreen;
