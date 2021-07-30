import {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import {Button, Col, Container, FormGroup, Row} from "react-bootstrap";
import classNames from "classnames";
import useEventListener from "@use-it/event-listener";
import {useIntl} from "react-intl";
import EqualWidthFormGroup from "../EqualWidthFormGroup";

function ConfigEditor({appState, appStateDispatch}) {
    const [configState, setConfigState] = useState(appState.config);
    const [submitted, setSubmitted] = useState(false);

    const [changeKey, setChangeKey] = useState(null);

    const intl = useIntl();
    const msg = (id) => intl.formatMessage({id: id});

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

    const ChangeKeyButton = ({keyName}) => (
        <Button className={classNames({active: changeKey === keyName})}
                style={{width: "100%"}}
                onClick={() => {
                    if (changeKey === keyName) {
                        setChangeKey(null);
                    } else {
                        setChangeKey(keyName);
                    }
                }}
        >
            {changeKey === keyName ?
                msg("config.press-button-to-change")
                :
                msg("config.change")
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
            return "<" + intl.formatMessage({id: "config.key." + key, defaultMessage: key}) + ">";
        }

        return key;
    }

    const KeyInput = ({keyName}) => (
        <FormGroup data-testid={"key-input-" + keyName}>
            <Row className="align-items-baseline">
                <Col xs={12} md={2}>
                    <label htmlFor={keyName}>
                        {msg('config.' + keyName)}:
                    </label>
                </Col>
                <Col>
                    {translateKey(configState[keyName])}
                </Col>
                <Col xs={7} md={6}>
                    <ChangeKeyButton keyName={keyName} />
                </Col>
            </Row>
        </FormGroup>
    )

    const keys = [
        "playKey",
        "nextSongKey",
        "previousSongKey"
    ]

    return (
        <Container className="config-editor-screen">
            <h1>
                {msg('config.settings')}
            </h1>

            <h2>
                {msg('config.keyboard-shortcuts')}
            </h2>

            {keys.map(keyName =>
                <KeyInput key={keyName} keyName={keyName} />
            )}

            <EqualWidthFormGroup>
                <Button onClick={apply}>
                    {msg('config.save')}
                </Button>

                <Link to="/" className="btn btn-link">
                    {msg('config.cancel')}
                </Link>
            </EqualWidthFormGroup>
        </Container>
    )
}

export default ConfigEditor;