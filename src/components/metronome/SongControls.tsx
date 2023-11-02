import SetlistView from "./SetlistView.tsx";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faEllipsisV, faListOl} from "@fortawesome/free-solid-svg-icons";
import {memo} from "react";
import {AppStateProps} from "../../lib/app-state.ts";

export type SongControlsProps = AppStateProps;

function WrappedSongControls({appState, appStateDispatch}: SongControlsProps) {
    //console.log("WrappedSongControls render")

    if (appState.setlist) {
        return (
            <SetlistView
                setlist={appState.setlist}
                activeSetlistIdx={appState.activeSetlistIdx}
                onSongSelect={idx => appStateDispatch({type: "setActiveSetlistIdx", payload: idx})}
                onSetlistDeselect={() => appStateDispatch({type: "setSetlist", payload: undefined})}
            />
        );
    } else {
        return (
            <div className="song-settings">
                <Link className="btn btn-primary" to={"/config"}>
                    <FontAwesomeIcon icon={faBars}/>
                </Link>
                <Link className="btn btn-primary" to={"/setlists"}>
                    <FontAwesomeIcon icon={faListOl}/>
                </Link>
                <Link className="btn btn-primary" to={"/currentsong"}>
                    <FontAwesomeIcon icon={faEllipsisV}/>
                </Link>
            </div>
        );
    }
}

const SongControls = memo(WrappedSongControls);

export default SongControls;
