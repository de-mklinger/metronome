import {Button} from "react-bootstrap";
import {ReactComponent as Logo} from "../images/logo.svg";
import useEventListener from "@use-it/event-listener";

function SplashScreen({onClick}) {
    useEventListener("keydown", onClick);

    return (
        <div className="splash-screen" onClick={onClick}>
            <div className="logo">
                <Logo/>
            </div>
            <div className="start">
                <Button>
                    Open Metronome
                </Button>
            </div>
        </div>
    );
}

export default SplashScreen;