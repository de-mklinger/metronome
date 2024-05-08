import BeatBar from "./BeatBar.js";
import SongControls from "./SongControls.tsx";
import PlayControls from "./PlayControls.tsx";
import MetronomeAudio from "./MetronomeAudio.tsx";
import { useCallback, useState } from "react";
import KeyListener from "./KeyListener.tsx";
import { useNoSleep } from "../../lib/no-sleep.ts";
import { useAppState } from "../../lib/use-app-state.ts";

function MetronomeView() {
  const appState = useAppState();
  const [started, setStarted] = useState(false);
  const onPlay = useCallback(() => {
    setStarted((started) => !started);
  }, []);

  const [activeBeatIdx, setActiveBeatIdx] = useState(-1);

  useNoSleep(appState.config.noSleepWhenStarted && started);

  return (
    <>
      {/*<NoSleepDebugView noSleep={noSleep} />*/}

      <MetronomeAudio
        started={started}
        song={appState.song}
        onActiveBeatIdxChange={setActiveBeatIdx}
      />

      <KeyListener
        onPlay={onPlay}
      />

      <BeatBar song={appState.song} activeBeatIdx={activeBeatIdx} />

      <SongControls />

      <PlayControls
        started={started}
        onPlay={onPlay}
      />
    </>
  );
}

export default MetronomeView;
