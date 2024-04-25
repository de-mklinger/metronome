import { useSetlists } from "../../lib/repository.ts";
import SetlistsList from "./SetlistsList.tsx";
import { useAppState } from "../../lib/app-state.tsx";
import { SetlistWithSongs } from "../../types.ts";
import { useNavigate } from "react-router-dom";

export default function SetlistsScreen() {
  const appState = useAppState();
  const { setlists } = useSetlists();
  const navigate = useNavigate();

  function selectSetlist(setlist: SetlistWithSongs) {
    appState.setlist = setlist;
    navigate(-1);
  }

  return (
    <>
      <h1>Setlists</h1>

      {setlists.length === 0 ? (
        <>No setlists</>
      ) : (
        <SetlistsList
          setlists={setlists}
          activeSetlistId={appState.setlist?.id}
          onSelect={selectSetlist}
        />
      )}
    </>
  );
}
