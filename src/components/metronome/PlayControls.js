import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";
import PlayButton from "./PlayButton";
import {getLabels} from "../../tempo";
import BpmKnob from "../BpmKnob";
import {useState} from "react";
import songRepository from "../../lib/songRepository";
import LoadingIndicator from "../LoadingIndicator";

function PlayControls({state, settings, onBpmChange, onPlay, onSongSelect}) {
    const [setlist, setSetlist] = useState(null);

    if (settings.setlistId && setlist === null) {
        songRepository.getSetlist(settings.setlistId).then(setSetlist);
        return (
            <LoadingIndicator />
        );
    }

    const onPreviousClick = () => {
        if (setlist) {
            const newIdx = settings.activeSetlistIdx - 1;
            if (newIdx >= 0) {
                onSongSelect(newIdx);
            }
        }
    }

    const onNextClick = () => {
        if (setlist) {
            const newIdx = settings.activeSetlistIdx + 1;
            if (newIdx < setlist.songs.length) {
                onSongSelect(newIdx);
            }
        }
    }

    return (
        <div className="play-controls">
            <div>
                {setlist
                    ?
                    <Button onClick={onPreviousClick}>
                        <FontAwesomeIcon icon={faStepBackward}/>
                    </Button>
                    :
                    <div/>
                }
                <PlayButton
                    started={state.started}
                    onPlay={onPlay} />
            </div>
            <div className="speed">
                <div id="current-bpm-label">
                    {getLabels(settings.bpm).join(", ")}
                </div>
                <div id="current-bpm">
                    {settings.bpm} BPM
                </div>

                <BpmKnob
                    key={settings.activeSetlistIdx} // Force applying rotation if new song was selected. Does not work when selecting song, changing bpm and selecting same song again :(
                    bpm={settings.bpm}
                    onBpmChange={onBpmChange}
                />
            </div>
            <div>
                {setlist
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