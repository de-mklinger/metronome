import useEventListener from "@use-it/event-listener";

function KeyListener({onPlay, appStateDispatch}) {
    const onKeyDown = e => {
        switch (e.key) {
            case " ":
                onPlay();
                break;
            case "ArrowRight":
                appStateDispatch({type: "nextSong"})
                break;
            case "ArrowLeft":
                appStateDispatch({type: "previousSong"})
                break;
            default:
                // fall-through
        }
        //console.log(e);
    };

    useEventListener("keydown", onKeyDown); // triggers app state dispatch twice :-(

    return null;
}

export default KeyListener;