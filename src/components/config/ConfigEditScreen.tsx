import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
import { ConfigKey } from "../../types.ts";
import useEventListener from "../../lib/use-event-listener.ts";
import { useAppState } from "../../lib/use-app-state.ts";
import Button from "../controls/Button.tsx";
import FormGroup from "../controls/FormGroup.tsx";
import Row from "../controls/Row.tsx";
import Col from "../controls/Col.tsx";
import Screen from "../controls/Screen.tsx";
import FormButtonsGroup from "../controls/FormButtonsGroup.tsx";

export default function ConfigEditScreen() {
  const appState = useAppState();
  const [configState, setConfigState] = useState(appState.config);

  const [changeKey, setChangeKey] = useState<ConfigKey>();

  useEventListener("keydown", (e) => {
    if (changeKey) {
      const newConfigState = { ...configState };
      newConfigState[changeKey] = e.key;
      setConfigState(newConfigState);
      setChangeKey(undefined);
    }
  });

  const navigate = useNavigate();

  const back = "/";

  const apply = () => {
    appState.config = configState;
    navigate(back);
  };

  const ChangeKeyButton = ({ keyName }: { keyName: ConfigKey }) => (
    <Button
      className={classNames({ active: changeKey === keyName })}
      style={{ width: "100%" }}
      onClick={() => {
        if (changeKey === keyName) {
          setChangeKey(undefined);
        } else {
          setChangeKey(keyName);
        }
      }}
    >
      <FormattedMessage
        id={
          changeKey === keyName
            ? "config.press-button-to-change"
            : "config.change"
        }
      />
    </Button>
  );

  const intl = useIntl();

  function translateKey(key: string): string | undefined {
    //console.log("key", key);

    if (" " === key) {
      return translateKey("Space");
    }
    if (!key) {
      return undefined;
    }
    if (key.length > 1) {
      return (
        "<" +
        intl.formatMessage({ id: "config.key." + key, defaultMessage: key }) +
        ">"
      );
    }

    return key;
  }

  const KeyInput = ({ keyName }: { keyName: ConfigKey }) => (
    <FormGroup data-testid={`key-input-${keyName}`}>
      <Row className="align-items-baseline">
        <Col xs={12} md={2}>
          <label htmlFor={keyName}>
            <FormattedMessage id={`config.${keyName}`} />:
          </label>
        </Col>
        <Col>{translateKey(configState[keyName])}</Col>
        <Col xs={7} md={6}>
          <ChangeKeyButton keyName={keyName} />
        </Col>
      </Row>
    </FormGroup>
  );

  const keys: ConfigKey[] = ["playKey", "nextSongKey", "previousSongKey"];

  return (
    <Screen name="config-editor" back={back}>
      <h1>
        <FormattedMessage id="config.settings" />
      </h1>

      <h2>
        <FormattedMessage id="config.keyboard-shortcuts" />
      </h2>

      {keys.map((keyName) => (
        <KeyInput key={keyName} keyName={keyName} />
      ))}

      <FormButtonsGroup>
        <Button onClick={apply}>
          <FormattedMessage id="save" />
        </Button>

        <Link to={back} className="btn btn-link">
          <FormattedMessage id="cancel" />
        </Link>
      </FormButtonsGroup>
    </Screen>
  );
}
