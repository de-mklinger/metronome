import useParam from "../../lib/use-param.ts";
import SetlistEditorPersistence from "./SetlistEditorPersistence.tsx";

export default function SetlistEditorByParam() {
  const id = useParam("id");

  return <SetlistEditorPersistence id={id} />
}
