import { Suspense } from "react";
import SetlistEditView from "./SetlistEditView.tsx";
import { useNavigate } from "react-router-dom";
import { useNewSetlist, useSetlist } from "../../lib/repository.ts";
import Button from "../controls/Button.tsx";

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
      <Button onClick={() => save(setlist)}>Save</Button>
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
      <Button onClick={() => save(setlist)}>Save</Button>
    </div>
  );
}
