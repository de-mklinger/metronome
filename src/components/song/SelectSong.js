import {ReactComponent as QuarterNoteSvg} from "../../images/quarter-note.svg";

function SelectSong({songs, onSelect}) {
    return (
        <div className="songs">
            <ul>
                {songs.map(song =>
                    <li key={song.id}>
                        <div className="title">
                            <div>
                                {song.title}
                            </div>
                            <div>
                                {song.timeSignatureBeats}/{song.timeSignatureNoteValue} <QuarterNoteSvg/> {song.bpm} BPM
                            </div>
                        </div>
                        <div className="actions">
                            <button className="btn btn-primary" onClick={() => onSelect(song)}>
                                Select
                            </button>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default SelectSong;