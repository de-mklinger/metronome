import { FormattedMessage } from "react-intl";
import Screen from "../controls/Screen.tsx";
import ImportExport from "./ImportExport.tsx";
import Base from "./Base.tsx";
import KeyboardShortcuts from "./KeyboardShortcuts.tsx";
import { useState } from "react";
import { ImportPreparation } from "../../lib/import-export.ts";
import ImportScreen from "./ImportScreen.tsx";

export default function ConfigEditScreen() {
  const back = "/";

  const [importPreparation, setImportPreparation] =
    useState<ImportPreparation>();

  if (importPreparation) {
    return (
      <ImportScreen
        importPreparation={importPreparation}
        onDone={() => setImportPreparation(undefined)}
      />
    );
  }

  return (
    <Screen name="config-editor" back={back}>
      <h1>
        <FormattedMessage id="config.settings" />
      </h1>

      <Base />

      <KeyboardShortcuts />

      <ImportExport onImportPreparation={setImportPreparation} />
    </Screen>
  );
}
