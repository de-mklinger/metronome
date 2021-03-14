import Setlist from "./Setlist";
import SongSettings from "./SongSettings";

function SongControls({settings, onTimeSignatureClick, onSongSelect}) {
    if (settings.setlist) {
        return (
            <Setlist
                setlist={settings.setlist}
                activeSetlistIdx={settings.activeSetlistIdx}
                onSongSelect={onSongSelect}
            />
        );
    } else {
        return (
            <SongSettings
                settings={settings}
                onTimeSignatureClick={onTimeSignatureClick}
            />
        );
    }
}

export default SongControls;