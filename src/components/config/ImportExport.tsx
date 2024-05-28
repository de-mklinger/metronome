import { FormattedMessage } from "react-intl";
import FormGroup from "../controls/FormGroup.tsx";
import Button from "../controls/Button.tsx";
import {
  createExportObject,
  ImportPreparation,
  prepareImport,
} from "../../lib/import-export.ts";
import { ChangeEvent } from "react";

export type ImportExportProps = {
  onImportPreparation: (importPreparation: ImportPreparation) => void;
};

export default function ImportExport({
  onImportPreparation,
}: ImportExportProps) {
  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) {
      return;
    }

    const file = e.target.files[0];
    const s = await readFile(file);

    const importPreparation = await prepareImport(s);
    onImportPreparation(importPreparation);
  }

  function handleImportClick() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("style", "display: none;");
    input.onchange = (e) => {
      handleImportFile(e as unknown as ChangeEvent<HTMLInputElement>).finally(
        () => {
          input.parentNode?.removeChild(input);
        },
      );
    };

    // Append to html
    document.body.appendChild(input);

    // Start upload
    input.click();
  }

  return (
    <>
      <h2>
        <FormattedMessage id="config.import-export" />
      </h2>

      <FormGroup>
        <Button onClick={handleImportClick}>
          <FormattedMessage id="config.import-data" />
        </Button>
      </FormGroup>
      <FormGroup>
        <Button onClick={handleExportClick}>
          <FormattedMessage id="config.export-data" />
        </Button>
      </FormGroup>
    </>
  );
}

function b64EncodeUnicode(str: string) {
  // first we use encodeURIComponent to get percent-encoded Unicode,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(_match, p1) {
        return String.fromCharCode(Number("0x" + p1));
      },
    ),
  );
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
    fr.onerror = (e) => {
      if (!e.target?.error) {
        reject(new Error("Unexpected read error"));
      } else {
        reject(e.target.error);
      }
    };
    fr.onloadend = (e) => {
      if (typeof e.target?.result !== "string") {
        reject(new Error("Unexpected read result"));
      } else {
        resolve(e.target.result);
      }
    };
    fr.readAsText(file, "UTF-8");
  });
}
