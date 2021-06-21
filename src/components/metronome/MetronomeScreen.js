import Metronome from "./Metronome";
import Div100vh from "react-div-100vh";

function MetronomeScreen({appState, appStateDispatch}) {
    return (
        <Div100vh className="metronome-screen">
            <Metronome appState={appState} appStateDispatch={appStateDispatch} />
        </Div100vh>
    )
}

export default MetronomeScreen;