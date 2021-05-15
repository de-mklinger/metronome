import Setlist from "./Setlist";
import SongSettings from "./SongSettings";

function SongControls({settings, onTimeSignatureClick, onSongSelect, onSetlistDeselect, onSetlistButtonClick}) {
    if (settings.setlistId) {
        return (
            <Setlist
                setlistId={settings.setlistId}
                activeSetlistIdx={settings.activeSetlistIdx}
                onSongSelect={onSongSelect}
                onSetlistDeselect={onSetlistDeselect}
                onSetlistButtonClick={onSetlistButtonClick}
            />
        );
    } else {
        return (
            <SongSettings
                settings={settings}
                onTimeSignatureClick={onTimeSignatureClick}
                onSetlistButtonClick={onSetlistButtonClick}
            />
        );
    }
}

export default SongControls;