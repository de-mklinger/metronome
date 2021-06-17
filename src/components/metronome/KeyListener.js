import useEventListener from "@use-it/event-listener";

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

    return null;
}

export default KeyListener;