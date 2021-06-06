import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleUp, faAngleDown, faTimes} from "@fortawesome/free-solid-svg-icons";

function Songs({songs, onSongsChange}) {
    const removeSongIdx = idx => {
        const newSongs = Array.from(songs);
        newSongs.splice(idx, 1);
        onSongsChange(newSongs);
    };

    const up = idx => {
        if (idx === 0) {
            return;
        }
        const newSongs = Array.from(songs);
        newSongs[idx - 1] = songs[idx];
        newSongs[idx] = songs[idx - 1];
        onSongsChange(newSongs);
    }

    const down = idx => {
        if (idx >= songs.length) {
            return;
        }
        const newSongs = Array.from(songs);
        newSongs[idx + 1] = songs[idx];
        newSongs[idx] = songs[idx + 1];
        onSongsChange(newSongs);
    }

    return (
        <div className="songs">
            <ul>
                {songs.map((song, idx) =>
                    <li key={idx}>
                        <span className="title">
                            {song.title}
                        </span>
                        <span className="settings">
                            <span className={"px-2" + (idx === 0 ? " invisible" : "")}>
                                <FontAwesomeIcon icon={faAngleUp} onClick={() => up(idx)}/>
                            </span>
                            <span className={"px-2" + (idx === songs.length - 1 ? " invisible" : "")}>
                                <FontAwesomeIcon icon={faAngleDown} onClick={() => down(idx)}/>
                            </span>
                            <span className="px-2">
                                <FontAwesomeIcon icon={faTimes} onClick={() => removeSongIdx(idx)}/>
                            </span>
                        </span>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default Songs;