import Setlist from "./Setlist";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV, faListOl} from "@fortawesome/free-solid-svg-icons";

function SongControls({appState, appStateDispatch}) {
    if (appState.setlist) {
        return (
            <Setlist
                setlist={appState.setlist}
                activeSetlistIdx={appState.activeSetlistIdx}
                onSongSelect={idx => appStateDispatch({type: "setActiveSetlistIdx", payload: idx})}
                onSetlistDeselect={() => appStateDispatch({type: "setSetlist", payload: null})}
            />
        );
    } else {
        return (
            <div className="song-settings">
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

export default SongControls;