import {useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import QuarterNoteSvg from "../../images/quarter-note.svg?react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV, faListOl, faTimes} from "@fortawesome/free-solid-svg-icons";
import {SetlistWithSongs, Song} from "../../types.ts";

export type SetlistViewProps = {
  setlist: SetlistWithSongs,
  activeSetlistIdx: number,
  onSongSelect: (idx: number) => void,
  onSetlistDeselect: () => void
}

function SetlistView({setlist, activeSetlistIdx, onSongSelect, onSetlistDeselect}: SetlistViewProps) {
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

type SetlistEntryProps = {
  song: Song,
  idx: number,
  active: boolean,
  onSongSelect: (idx: number) => void
}

function SetlistEntry({song, idx, active, onSongSelect}: SetlistEntryProps) {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(
        () => {
            if (active && ref.current) {
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

export default SetlistView;
