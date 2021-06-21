import {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {Button, Container} from "react-bootstrap";
import classNames from "classnames";
import useEventListener from "@use-it/event-listener";

function ConfigEditor({appState, appStateDispatch}) {
    const [configState, setConfigState] = useState(appState.config);
    const [submitted, setSubmitted] = useState(false);

    const [changeKey, setChangeKey] = useState(null);

    useEventListener("keydown", e => {
        if (changeKey) {
            const newConfigState = {...configState};
            newConfigState[changeKey] = e.key;
            setConfigState(newConfigState);
            setChangeKey(null);
        }
    });

    if (submitted) {
        return <Redirect to="/"/>
    }

    const apply = () => {
        appStateDispatch({type: "setConfig", payload: configState});
        setSubmitted(true);
    }

    console.log("change key:", changeKey)

    const ChangeKeyButton = ({keyName}) => (
        <Button className={classNames({active: changeKey === keyName})}
                onClick={() => {
                    if (changeKey === keyName) {
                        setChangeKey(null);
                    } else {
                        setChangeKey(keyName);
                    }
                }}
        >
            {changeKey === keyName ?
                "Press Button to change"
                :
                "Change..."
            }
        </Button>
    );

    const translateKey = (key) => {
        //console.log("key", key);

        if (" " === key) {
            return translateKey("Space");
        }
        if (!key) {
            return null;
        }
        if (key.length > 1) {
            return "<" + key + ">";
        }

        return key;
    }

    const KeyInput = ({keyName}) => (
        <div>
            {translateKey(configState[keyName])}
            <ChangeKeyButton keyName={keyName} />
        </div>
    )

    return (
        <Container className="config-editor-screen">
            <h1>Settings</h1>

            <h2>Keyboard Shortcuts</h2>

            <div className="form-group">
                <label htmlFor="playKey">Start/Stop</label>
                <KeyInput keyName="playKey" />
            </div>

            <div className="form-group">
                <label htmlFor="nextSongKey">Next Song</label>
                <KeyInput keyName="nextSongKey" />
            </div>

            <div className="form-group">
                <label htmlFor="previousSongKey">Previous Song</label>
                <KeyInput keyName="previousSongKey" />
            </div>

            <div className="form-group">
                <Button className="btn-primary" onClick={apply}>
                    Save
                </Button>

                <Link to="/" className="btn btn-link">Cancel</Link>
            </div>
        </Container>
    )
}

export default ConfigEditor;