import { memo } from "react";
import { useAppState } from "../../lib/use-app-state.ts";
import useEventListener from "../../lib/use-event-listener.ts";

export type KeyListenerProps = {
  onPlay: () => void;
};

function WrappedKeyListener({onPlay}: KeyListenerProps) {
    //console.log("WrappedKeyListener Render");

  const appState = useAppState();

  const onKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case appState.config.playKey:
                e.stopPropagation();
                onPlay();
                break;
            case appState.config.nextSongKey:
                e.stopPropagation();
                appState.nextSong();
                break;
            case appState.config.previousSongKey:
                e.stopPropagation();
                appState.previousSong();
                break;
            default:
                // fall-through
        }
        //console.log(e);
    };

    useEventListener("keydown", onKeyDown); // triggers app state dispatch twice :-(


    // Set focus - do we need this?

    // const inputRef = useRef<HTMLInputElement>(null);
    //
    // useEffect(() => {
    //     inputRef.current.focus();
    // })
    //
    // return (
    //     <input type="text"
    //            style={{display: "none"}}
    //            ref={inputRef}
    //            value=""
    //            onChange={console.log}
    //     />
    // )

    return <></>
}

const KeyListener = memo(WrappedKeyListener);

export default KeyListener;
