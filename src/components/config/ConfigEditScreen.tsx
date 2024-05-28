import { FormattedMessage } from "react-intl";
import Screen from "../controls/Screen.tsx";
import ImportExport from "./ImportExport.tsx";
import Base from "./Base.tsx";
import KeyboardShortcuts from "./KeyboardShortcuts.tsx";

export default function ConfigEditScreen() {
  const back = "/";

  return (
    <Screen name="config-editor" back={back}>
      <h1>
        <FormattedMessage id="config.settings" />
      </h1>

      <Base />

      <KeyboardShortcuts />

      <ImportExport />
    </Screen>
  );
}
