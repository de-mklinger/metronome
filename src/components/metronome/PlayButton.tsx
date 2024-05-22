import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "../controls/Button.tsx";

export type PlayButtonProps = {
    started: boolean,
    onPlay: () => void
}

function PlayButton(props: PlayButtonProps) {
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
