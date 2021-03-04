import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function PlayButton(props) {
    let playButtonIcon;
    if (props.started) {
        playButtonIcon = faPause;
    } else {
        playButtonIcon = faPlay;
    }

    return (
        <button id="button-play" onClick={props.onPlay}>
            <FontAwesomeIcon icon={playButtonIcon}/>
        </button>
    );
}

export default PlayButton;