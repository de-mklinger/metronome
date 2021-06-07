import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleUp, faAngleDown, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";

function SetlistEditorSongs({songs, onSongsChange}) {
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
                        <div className="title">
                            {song.title}
                        </div>
                        <div className="actions">
                            {songs.length > 1 &&
                                <>
                                    <Button
                                        variant="secondary"
                                        className={(idx === 0 ? " invisible" : "")}
                                        onClick={() => up(idx)}>
                                        <FontAwesomeIcon icon={faAngleUp} />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className={(idx === songs.length - 1 ? " invisible" : "")}
                                        onClick={() => down(idx)}>
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </Button>
                                </>
                            }
                            <Button
                                variant="secondary"
                                onClick={() => removeSongIdx(idx)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </Button>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default SetlistEditorSongs;