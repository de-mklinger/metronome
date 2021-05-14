import {useRef, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {ReactComponent as QuarterNoteSvg} from "../images/quarter-note.svg";
import songRepository from "../lib/songRepository";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV, faTimes} from "@fortawesome/free-solid-svg-icons";
import LoadingIndicator from "./LoadingIndicator";


function Setlist({setlistId, activeSetlistIdx, onSongSelect, onSetlistDeselect, onSetlistButtonClick}) {
    const [setlist, setSetlist] = useState(null);

    if (setlist === null) {
        songRepository.getSetlist(setlistId).then(setSetlist);
        return (
            <LoadingIndicator />
        );
    }

    return (
        <div className="setlist">
            <ul>
                <li className="header">
                    <div className="title">
                        Setlist: {setlist.title}
                    </div>
                    <div className="settings">
                        <span className="px-2" onClick={onSetlistDeselect}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                        <span className="pl-2" onClick={onSetlistButtonClick}>
                            <FontAwesomeIcon icon={faEllipsisV}/>
                        </span>
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
                <Link className="pl-2" to={"/songs/" + encodeURIComponent(song.id)}>
                    <FontAwesomeIcon icon={faEllipsisV}/>
                </Link>
            </div>
        </li>
    );
}

export default Setlist;