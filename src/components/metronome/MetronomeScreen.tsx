import MetronomeView from "./MetronomeView.tsx";
import Div100vh from "react-div-100vh";

function MetronomeScreen() {
  return (
    <Div100vh className="metronome-screen">
      <MetronomeView />
    </Div100vh>
  );
}

export default MetronomeScreen;
