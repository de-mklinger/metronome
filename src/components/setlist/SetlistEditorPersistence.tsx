import {Suspense} from "react";
import SetlistEditView from "./SetlistEditView.tsx";
import {useNavigate} from "react-router-dom";
import {useNewSetlist, useSetlist} from "../../lib/repository.ts";

export type SetlistEditorPersistenceProps = {
  id: string
}

export default function SetlistEditorPersistence({id}: SetlistEditorPersistenceProps) {
  return (
    <Suspense fallback={<>schwurbel</>}>
      <InnerComponent id={id} />
    </Suspense>
  )
}

function InnerComponent({id}: SetlistEditorPersistenceProps) {
  const {setlist, update, save, wasSaved} =
    id === "_new_" ? useNewSetlist() : useSetlist(id);

  const navigate = useNavigate();

  if (wasSaved) {
    navigate(-1);
  }

  return (
    <div>
      <SetlistEditView setlist={setlist} onChange={update} />
      <button onClick={() => save(setlist)}>Save</button>
    </div>
  )
}
