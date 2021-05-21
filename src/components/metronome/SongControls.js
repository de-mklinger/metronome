import Setlist from "./Setlist";
import SongSettings from "./SongSettings";

function SongControls({setlist, activeSetlistIdx, timeSignatureBeats, timeSignatureNoteValue,
                          onSongSelect, onSetlistDeselect, onTimeSignatureClick}) {
    if (setlist) {
        return (
            <Setlist
                setlist={setlist}
                activeSetlistIdx={activeSetlistIdx}
                onSongSelect={onSongSelect}
                onSetlistDeselect={onSetlistDeselect}
            />
        );
    } else {
        return (
            <SongSettings
                timeSignatureBeats={timeSignatureBeats}
                timeSignatureNoteValue={timeSignatureNoteValue}
                onTimeSignatureClick={onTimeSignatureClick}
            />
        );
    }
}

export default SongControls;