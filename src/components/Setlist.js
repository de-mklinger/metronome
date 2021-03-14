import {useRef, useEffect} from 'react';
import {ReactComponent as QuarterNoteSvg} from "../images/quarter-note.svg";

function Setlist({setlist, activeSetlistIdx, onSongSelect}) {
    return (
        <div className="setlist">
            <ul>
                {setlist.songs.map((song, idx) =>
                    <SetlistEntry
                        song={song}
                        idx={idx}
                        active={idx === activeSetlistIdx}
                        onSongSelect={onSongSelect}
                    />
                )}
            </ul>
        </div>
    )
}

function SetlistEntry({song, idx, active, onSongSelect}) {
    const ref = useRef();

    useEffect(
        () => {
            if (active) {
                ref.current.scrollIntoView({behavior: 'smooth'});
            }
        },
        [active]
    );

    return (
        <li
            ref={ref}
            key={song.id}
            className={active ? 'active' : ''}
            onClick={() => onSongSelect(idx)}>
            <div className="song-title">
                {song.title}
            </div>
            <div className="song-settings">
                {song.timeSignatureBeats}/{song.timeSignatureNoteValue} <QuarterNoteSvg/> {song.bpm} BPM
            </div>
        </li>
    );
}

export default Setlist;