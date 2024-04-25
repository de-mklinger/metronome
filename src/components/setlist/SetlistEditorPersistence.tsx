import { Suspense } from "react";
import SetlistEditView from "./SetlistEditView.tsx";
import { useNavigate } from "react-router-dom";
import { useNewSetlist, useSetlist } from "../../lib/repository.ts";

export type SetlistEditorPersistenceProps = {
  id: string;
};

export default function SetlistEditorPersistence({
  id,
}: SetlistEditorPersistenceProps) {
  return (
    <Suspense fallback={<>schwurbel</>}>
      {
        id === "_new_"
        ? <InnerComponentNewSetlist />
        : <InnerComponentSetlist id={id} />
      }
    </Suspense>
  );
}

function InnerComponentSetlist({ id }: SetlistEditorPersistenceProps) {
  const { setlist, update, save, wasSaved } = useSetlist(id);

  const navigate = useNavigate();

  if (wasSaved) {
    navigate(-1);
  }

  return (
    <div>
      <SetlistEditView setlist={setlist} onChange={update} />
      <button onClick={() => save(setlist)}>Save</button>
    </div>
  );
}

function InnerComponentNewSetlist() {
  const { setlist, update, save, wasSaved } = useNewSetlist();

  const navigate = useNavigate();

  if (wasSaved) {
    navigate(-1);
  }

  return (
    <div>
      <SetlistEditView setlist={setlist} onChange={update} />
      <button onClick={() => save(setlist)}>Save</button>
    </div>
  );
}
