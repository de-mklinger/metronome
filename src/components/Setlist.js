import {ReactComponent as QuarterNoteSvg} from "../images/quarter-note.svg";

function Setlist({setlist, activeSetlistIdx, onSongSelect}) {
    const songs = setlist.songs.map((song, idx) =>
        <li
            key={song.id}
            className={idx === activeSetlistIdx ? 'active' : ''}
            onClick={() => onSongSelect(idx)}
        >
            <div className="song-title">
                {song.title}
            </div>
            <div className="song-settings">
                {song.timeSignatureBeats}/{song.timeSignatureNoteValue} <QuarterNoteSvg/> {song.bpm} BPM
            </div>
        </li>
    )

    return (
        <div className="setlist">
            <ul>
                {songs}
            </ul>
        </div>
    )
}

export default Setlist;