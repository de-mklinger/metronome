import { memo } from "react";
import { useAppState } from "../../lib/use-app-state.ts";
import useEventListener from "../../lib/use-event-listener.ts";

export type KeyListenerProps = {
  onPlay: () => void;
};

function WrappedKeyListener({ onPlay }: KeyListenerProps) {
  const appState = useAppState();

  const onKeyDown = (e: KeyboardEvent) => {
    function stopEvent() {
      e.stopPropagation();
      e.preventDefault();
    }

    switch (e.key) {
      case appState.config.playKey:
        onPlay();
        stopEvent();
        break;
      case appState.config.nextSongKey:
        appState.nextSong();
        stopEvent();
        break;
      case appState.config.previousSongKey:
        appState.previousSong();
        stopEvent();
        break;
      default:
      // fall-through
    }
  };

  useEventListener("keydown", onKeyDown); // triggers app state dispatch twice :-(

  return <></>;
}

const KeyListener = memo(WrappedKeyListener);

export default KeyListener;
