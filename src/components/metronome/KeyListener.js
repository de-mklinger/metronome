import useEventListener from "@use-it/event-listener";
import {useEffect, useRef} from "react";

function KeyListener({onPlay, config, appStateDispatch}) {
    const onKeyDown = e => {
        switch (e.key) {
            case config.playKey:
                onPlay();
                break;
            case config.nextSongKey:
                appStateDispatch({type: "nextSong"})
                break;
            case config.previousSongKey:
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

export default KeyListener;