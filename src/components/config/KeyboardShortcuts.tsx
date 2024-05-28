import { useAppState } from "../../lib/use-app-state.ts";
import { useState } from "react";
import { ConfigKey } from "../../types.ts";
import useEventListener from "../../lib/use-event-listener.ts";
import Button from "../controls/Button.tsx";
import classNames from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
import FormGroup from "../controls/FormGroup.tsx";
import Row from "../controls/Row.tsx";
import Col from "../controls/Col.tsx";

export default function KeyboardShortcuts() {
  const appState = useAppState();
  const [changeKey, setChangeKey] = useState<ConfigKey>();

  useEventListener("keydown", (e) => {
    if (changeKey) {
      const newConfigState = { ...appState.config };
      newConfigState[changeKey] = e.key;
      setChangeKey(undefined);
      appState.config = newConfigState;
    }
  });

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
        <Col>{translateKey(appState.config[keyName])}</Col>
        <Col xs={7} md={6}>
          <ChangeKeyButton keyName={keyName} />
        </Col>
      </Row>
    </FormGroup>
  );

  const keys: ConfigKey[] = ["playKey", "nextSongKey", "previousSongKey"];

  return (
    <>
      <h2>
        <FormattedMessage id="config.keyboard-shortcuts" />
      </h2>

      {keys.map((keyName) => (
        <KeyInput key={keyName} keyName={keyName} />
      ))}
    </>
  );
}
