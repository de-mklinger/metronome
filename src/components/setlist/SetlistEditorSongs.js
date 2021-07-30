import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import {ReactComponent as QuarterNoteSvg} from "../../images/quarter-note.svg";
import EqualWidthGrid from "../EqualWidthGrid";

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
                            <div>
                                {song.title}
                            </div>
                            <div className="small">
                                {song.timeSignatureBeats}/{song.timeSignatureNoteValue} <QuarterNoteSvg/> {song.bpm} BPM
                            </div>
                        </div>
                        <EqualWidthGrid>
                            <Button
                                variant="secondary"
                                className={{"invisible": idx === 0 || songs.length <= 1}}
                                onClick={() => up(idx)}>
                                <FontAwesomeIcon icon={faAngleUp} />
                            </Button>
                            <Button
                                variant="secondary"
                                className={{"invisible": idx === songs.length - 1 || songs.length <= 1}}
                                onClick={() => down(idx)}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => removeSongIdx(idx)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </Button>
                        </EqualWidthGrid>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default SetlistEditorSongs;