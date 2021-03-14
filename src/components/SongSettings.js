import Button from "react-bootstrap/Button";
import {ReactComponent as QuarterNoteSvg} from "../images/quarter-note.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-regular-svg-icons";

function SongSettings({settings, onTimeSignatureClick}) {
    return (
        <div id="song-settings">
            <Button onClick={onTimeSignatureClick}>
                {settings.timeSignatureBeats}
                /
                {settings.timeSignatureNoteValue}
            </Button>
            <Button id="button-subdivisions"><QuarterNoteSvg/></Button>
            <Button id="button-song-length"><FontAwesomeIcon icon={faClock}/></Button>
        </div>
    );
}

export default SongSettings;