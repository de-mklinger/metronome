import { doImport, ImportPreparation } from "../../lib/import-export.ts";
import Screen from "../controls/Screen.tsx";
import FormButtonsGroup from "../controls/FormButtonsGroup.tsx";
import Button from "../controls/Button.tsx";
import CancelButton from "../controls/CancelButton.tsx";
import { useState } from "react";
import LoadingIndicator from "../common/LoadingIndicator.tsx";

export type ImportScreenProps = {
  importPreparation: ImportPreparation;
  onDone: () => void;
};

export default function ImportScreen({
  importPreparation,
  onDone,
}: ImportScreenProps) {
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState<unknown>();

  async function handleImportClick() {
    try {
      if (!importPreparation.data) {
        throw new Error("Missing import data");
      }

      setInProgress(true);
      await doImport(importPreparation.data);
      onDone();
    } catch (error) {
      setError(error);
    }
  }

  if (error) {
    throw error;
  }

  if (inProgress) {
    return <LoadingIndicator />;
  }

  return (
    <Screen name="import" back={onDone}>
      <p>Can import: {Boolean(importPreparation.data).toString()}</p>
      {importPreparation.comments.map((c) => (
        <p key={c}>{c}</p>
      ))}

      <FormButtonsGroup>
        <Button disabled={!importPreparation} onClick={handleImportClick}>
          Import
        </Button>
        <CancelButton back={onDone} />
      </FormButtonsGroup>
    </Screen>
  );
}
