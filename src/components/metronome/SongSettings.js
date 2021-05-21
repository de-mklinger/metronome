import Button from "react-bootstrap/Button";
import {ReactComponent as QuarterNoteSvg} from "../../images/quarter-note.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-regular-svg-icons";
import {faList} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

function SongSettings({timeSignatureBeats, timeSignatureNoteValue, onTimeSignatureClick}) {
    return (
        <div className="song-settings">
            <Button onClick={onTimeSignatureClick}>
                {timeSignatureBeats}
                /
                {timeSignatureNoteValue}
            </Button>
            <Button>
                <QuarterNoteSvg/>
            </Button>
            <Button>
                <FontAwesomeIcon icon={faClock}/>
            </Button>
            <Link className="btn btn-primary" to={"/setlists"}>
                <FontAwesomeIcon icon={faList}/>
            </Link>
        </div>
    );
}

export default SongSettings;