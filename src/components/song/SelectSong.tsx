import QuarterNoteSvg from "../../images/quarter-note.svg?react";
import {Song} from "../../types.ts";

export type SelectSongProps = {
  songs: Song[]
  onSelect: (song: Song) => void
}

function SelectSong({songs, onSelect}: SelectSongProps) {
    return (
        <div className="songs">
            <ul>
                {songs.map(song =>
                    <li key={song.id}>
                        <div className="title">
                            <div className="title">
                                {song.title}
                            </div>
                            <div className="title">
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
