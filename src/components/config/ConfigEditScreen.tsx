import { ChangeEvent, useState } from "react";
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
import { createExportObject } from "../../lib/export-import.ts";

export default function ConfigEditScreen() {
  const appState = useAppState();
  // const [configState, setConfigState] = useState(appState.config);

  const [changeKey, setChangeKey] = useState<ConfigKey>();

  // const navigate = useNavigate();

  const back = "/";

  // const apply = () => {
  //   console.log("Applying config:", appState.config);
  //   appState.config = configState;
  //   // navigate(back);
  // };

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

  function b64EncodeUnicode(str: string) {
    // first we use encodeURIComponent to get percent-encoded Unicode,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(_match, p1) {
        return String.fromCharCode(Number('0x' + p1));
      }));
  }
  
  async function handleExportClick() {
    const exportObject = await createExportObject();

    const dataUrl = `data:application/json;base64,${b64EncodeUnicode(JSON.stringify(exportObject))}`;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.setAttribute("download", "metronome-data.json");

    // Append to html
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
  }

  async function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = e => {
        if (!e.target?.error) {
          reject(new Error("Unexpected read error"));
        } else {
          reject(e.target.error);
        }
      }
      fr.onloadend = e => {
        if (typeof e.target?.result !== "string") {
          reject(new Error("Unexpected read result"));
        } else {
          resolve(e.target.result)
        }
      }
      fr.readAsText(file, "UTF-8");
    });
  }

  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) {
      return;
    }

    const file = e.target.files[0];

    console.log(file);

    const s = await readFile(file);

    console.log(s);

    const obj = JSON.parse(s);

    console.log(obj);
  }

  function handleLanguageChange(e: ChangeEvent<HTMLSelectElement>) {
    const locale = e.target.value ?? undefined;
    console.log("Switching locale to", locale);
    appState.config = {
      ...appState.config,
      locale,
    };
  }

  return (
    <Screen name="config-editor" back={back}>
      <h1>
        <FormattedMessage id="config.settings" />
      </h1>

      <h2>
        <FormattedMessage id="config.base" />
      </h2>

      <FormGroup>
        <label htmlFor="language-select">
          <FormattedMessage id="config.language" />
        </label>
        <select
          className="form-control"
          value={appState.config.locale}
          onChange={handleLanguageChange}
          id="language-select"
        >
          <option value="">
            <FormattedMessage id="config.browser-language" />
          </option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </FormGroup>

      <h2>
        <FormattedMessage id="config.keyboard-shortcuts" />
      </h2>

      {keys.map((keyName) => (
        <KeyInput key={keyName} keyName={keyName} />
      ))}

      <h2>
        <FormattedMessage id="config.import-export" />
      </h2>

      <FormGroup>
        <Button>
          <FormattedMessage id="config.import-data" />
        </Button>
        <input type="file" onChange={handleImportFile} />
      </FormGroup>
      <FormGroup>
        <Button onClick={handleExportClick}>
          <FormattedMessage id="config.export-data" />
        </Button>
      </FormGroup>
    </Screen>
  );
}
