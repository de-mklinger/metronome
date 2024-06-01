import SetlistView from "./SetlistView.tsx";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faBars,
  faEllipsisV,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
import { useAppState } from "../../lib/use-app-state.ts";
import { useCallback } from "react";

export default function SongControls() {
  const appState = useAppState();

  const onSongSelect = useCallback(
    (idx: number) => {
      appState.songIdx = idx;
    },
    [appState],
  );

  const onSetlistDeselect = useCallback(() => {
    appState.setlist = undefined;
  }, [appState]);

  if (appState.setlist) {
    return (
      <SetlistView
        setlist={appState.setlist}
        songIdx={appState.songIdx}
        onSongSelect={onSongSelect}
        onSetlistDeselect={onSetlistDeselect}
      />
    );
  } else {
    return (
      <div className="song-settings">
        <Link className="btn btn-primary" to={"/config"}>
          <FontAwesomeIcon icon={faGear} />
        </Link>
        <Link className="btn btn-primary" to={"/songs"}>
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
