import {Button} from "react-bootstrap";
import Logo from "../images/logo.svg?react";
import useEventListener from "../lib/use-event-listener.ts";

export type SplashScreenProps = {
  onClick: () => void
}

function SplashScreen({onClick}: SplashScreenProps) {
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