import SetlistView from "./SetlistView.tsx";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEllipsisV,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
import { useAppState } from "../../lib/use-app-state.ts";

export default function SongControls() {
  //console.log("WrappedSongControls render")

  const appState = useAppState();

  if (appState.setlist) {
    return (
      <SetlistView
        setlist={appState.setlist}
        songIdx={appState.songIdx}
        onSongSelect={(idx) => {
          appState.songIdx = idx;
        }}
        onSetlistDeselect={() => {
          appState.setlist = undefined;
        }}
      />
    );
  } else {
    return (
      <div className="song-settings">
        <Link className="btn btn-primary" to={"/config"}>
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <Link className="btn btn-primary" to={"/setlists"}>
          <FontAwesomeIcon icon={faListOl} />
        </Link>
        <Link className="btn btn-primary" to={"/currentsong"}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </Link>
      </div>
    );
  }
}
