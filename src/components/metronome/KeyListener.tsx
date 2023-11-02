import {memo} from "react";
import {AppStateProps} from "../../lib/app-state.ts";
import useEventListener from "../../lib/use-event-listener.ts";

export type KeyListenerProps = AppStateProps<{
    onPlay: () => void,
}>

function WrappedKeyListener({onPlay, appState, appStateDispatch}: KeyListenerProps) {
    //console.log("WrappedKeyListener Render");

    const {config} = appState;

    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case config.playKey:
                e.stopPropagation();
                onPlay();
                break;
            case config.nextSongKey:
                e.stopPropagation();
                appStateDispatch({type: "nextSong"})
                break;
            case config.previousSongKey:
                e.stopPropagation();
                appStateDispatch({type: "previousSong"})
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
