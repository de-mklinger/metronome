import useEventListener from "@use-it/event-listener";
import {memo, useEffect, useRef} from "react";

function WrappedKeyListener({onPlay, config, appStateDispatch}) {
    console.log("WrappedKeyListener Render");

    const onKeyDown = e => {
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

    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    })

    return (
        <input type="text"
               style={{display: "none"}}
               ref={inputRef}
               value=""
               onChange={console.log}
        />
    )
}

const KeyListener = memo(WrappedKeyListener);

export default KeyListener;