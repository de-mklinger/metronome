import Button from "react-bootstrap/Button";
import {ReactComponent as QuarterNoteSvg} from "../images/quarter-note.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-regular-svg-icons";
import {faList} from "@fortawesome/free-solid-svg-icons";

function SongSettings({settings, onTimeSignatureClick, onSetlistButtonClick}) {
    return (
        <div className="song-controls song-settings">
            <Button onClick={onTimeSignatureClick}>
                {settings.timeSignatureBeats}
                /
                {settings.timeSignatureNoteValue}
            </Button>
            <Button>
                <QuarterNoteSvg/>
            </Button>
            <Button>
                <FontAwesomeIcon icon={faClock}/>
            </Button>
            <Button onClick={onSetlistButtonClick}>
                <FontAwesomeIcon icon={faList}/>
            </Button>
        </div>
    );
}

export default SongSettings;