import { useSetlists } from "../../lib/repository.ts";
import SetlistsList from "./SetlistsList.tsx";
import { useAppState } from "../../lib/use-app-state.ts";
import { SetlistWithSongs } from "../../types.ts";
import {Link, useNavigate} from "react-router-dom";
import Screen from "../controls/Screen.tsx";
import FormButtonsGroup from "../controls/FormButtonsGroup.tsx";

export default function SetlistsScreenNew() {
  const appState = useAppState();
  const { setlists } = useSetlists();
  const navigate = useNavigate();

  function selectSetlist(setlist: SetlistWithSongs) {
    appState.setlist = setlist;
    navigate(-1);
  }

  return (
    <Screen name="setlists">
      <h1>Setlists</h1>

      {setlists.length === 0 ? (
        <p>No setlists</p>
      ) : (
        <SetlistsList
          setlists={setlists}
          activeSetlistId={appState.setlist?.id}
          onSelect={selectSetlist}
        />
      )}

      <FormButtonsGroup>
        <Link className="btn btn-primary" to={"/setlists/_new_"}>
          New...
        </Link>
      </FormButtonsGroup>
    </Screen>
  );
}
