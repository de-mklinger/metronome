import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";
import PlayButton from "./PlayButton";
import {getLabels} from "../../lib/tempo";
import BpmKnob from "../BpmKnob";

function PlayControls({started, appState, appStateDispatch, onPlay}) {
    const onBpmChange = bpm => appStateDispatch({type: "setBpm", payload: bpm});
    const onPreviousClick = () => appStateDispatch({type: "previousSong"});
    const onNextClick = () => appStateDispatch({type: "nextSong"});

    return (
        <div className="play-controls">
            <div>
                {appState.setlist
                    ?
                    <Button onClick={onPreviousClick}>
                        <FontAwesomeIcon icon={faStepBackward}/>
                    </Button>
                    :
                    <div/>
                }
                <PlayButton
                    started={started}
                    onPlay={onPlay} />
            </div>
            <div className="speed">
                <div id="current-bpm-label">
                    {getLabels(appState.song.bpm).join(", ")}
                </div>
                <div id="current-bpm">
                    {appState.song.bpm} BPM
                </div>

                <BpmKnob
                    key={appState.activeSetlistIdx} // Force applying rotation if new song was selected. Does not work when selecting song, changing bpm and selecting same song again :(
                    bpm={appState.song.bpm}
                    onBpmChange={onBpmChange}
                />
            </div>
            <div>
                {appState.setlist
                    ?
                    <Button onClick={onNextClick}>
                        <FontAwesomeIcon icon={faStepForward}/>
                    </Button>
                    :
                    <div/>
                }
                <Button>Tap</Button>
            </div>
        </div>
    );
}

export default PlayControls;