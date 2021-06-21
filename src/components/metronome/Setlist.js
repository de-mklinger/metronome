import {useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {ReactComponent as QuarterNoteSvg} from "../../images/quarter-note.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV, faListOl, faTimes} from "@fortawesome/free-solid-svg-icons";


function Setlist({setlist, activeSetlistIdx, onSongSelect, onSetlistDeselect}) {
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
                        <Link className="px-2" to={"/setlists"}>
                            <FontAwesomeIcon icon={faListOl}/>
                        </Link>
                        <Link className="px-2" to={"/setlists/" + encodeURIComponent(setlist.id)}>
                            <FontAwesomeIcon icon={faEllipsisV}/>
                        </Link>
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
            className={active ? 'active' : ''}
            onClick={() => onSongSelect(idx)}>
            <span ref={ref} className="scroll-target"/>
            <div className="title">
                {song.title}
            </div>
            <div className="settings">
                {song.timeSignatureBeats}/{song.timeSignatureNoteValue} <QuarterNoteSvg/> {song.bpm} BPM
                <Link className="px-2" to={"/songs/" + encodeURIComponent(song.id)} onClick={e => e.stopPropagation()}>
                    <FontAwesomeIcon icon={faEllipsisV}/>
                </Link>
            </div>
        </li>
    );
}

export default Setlist;