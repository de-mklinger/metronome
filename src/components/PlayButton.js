import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from 'react-bootstrap/Button';

function PlayButton(props) {
    let playButtonIcon;
    if (props.started) {
        playButtonIcon = faPause;
    } else {
        playButtonIcon = faPlay;
    }

    return (
        <Button id="button-play" onPointerDown={props.onPlay}>
            <FontAwesomeIcon icon={playButtonIcon}/>
        </Button>
    );
}

export default PlayButton;