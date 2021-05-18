import Setlist from "./Setlist";
import SongSettings from "./SongSettings";

function SongControls({setlistId, activeSetlistIdx, timeSignatureBeats, timeSignatureNoteValue,
                          onSongSelect, onSetlistDeselect, onSetlistButtonClick, onTimeSignatureClick}) {
    if (setlistId) {
        return (
            <Setlist
                setlistId={setlistId}
                activeSetlistIdx={activeSetlistIdx}
                onSongSelect={onSongSelect}
                onSetlistDeselect={onSetlistDeselect}
                onSetlistButtonClick={onSetlistButtonClick}
            />
        );
    } else {
        return (
            <SongSettings
                timeSignatureBeats={timeSignatureBeats}
                timeSignatureNoteValue={timeSignatureNoteValue}
                onTimeSignatureClick={onTimeSignatureClick}
                onSetlistButtonClick={onSetlistButtonClick}
            />
        );
    }
}

export default SongControls;