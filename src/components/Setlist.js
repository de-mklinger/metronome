import {useRef, useEffect} from 'react';
import {ReactComponent as QuarterNoteSvg} from "../images/quarter-note.svg";

function Setlist({setlist, activeSetlistIdx, onSongSelect, onSetlistDeselect}) {
    return (
        <div className="song-controls setlist">
            <ul>
                <li className="header">
                    <div className="title">
                        Setlist
                    </div>
                    <div className="settings">
                        <span onClick={onSetlistDeselect}>X</span>
                    </div>
                </li>
                {setlist.songs.map((song, idx) =>
                    <SetlistEntry
                        key={idx}
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
            className={active ? 'active' : ''}
            onClick={() => onSongSelect(idx)}>
            <div className="title">
                {song.title}
            </div>
            <div className="settings">
                {song.timeSignatureBeats}/{song.timeSignatureNoteValue} <QuarterNoteSvg/> {song.bpm} BPM
            </div>
        </li>
    );
}

export default Setlist;