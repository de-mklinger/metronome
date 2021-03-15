import Setlist from "./Setlist";
import SongSettings from "./SongSettings";

function SongControls({settings, onTimeSignatureClick, onSongSelect, onSetlistDeselect, onSetlistButtonClick}) {
    if (settings.setlist) {
        return (
            <Setlist
                setlist={settings.setlist}
                activeSetlistIdx={settings.activeSetlistIdx}
                onSongSelect={onSongSelect}
                onSetlistDeselect={onSetlistDeselect}
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