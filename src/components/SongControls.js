import Setlist from "./Setlist";
import SongSettings from "./SongSettings";

function SongControls({settings, onTimeSignatureClick, onSongSelect, onSetlistDeselect, onSetlistButtonClick}) {
    let child;

    if (settings.setlist) {
        child = (
            <Setlist
                setlist={settings.setlist}
                activeSetlistIdx={settings.activeSetlistIdx}
                onSongSelect={onSongSelect}
                onSetlistDeselect={onSetlistDeselect}
                onSetlistButtonClick={onSetlistButtonClick}
            />
        );
    } else {
        child = (
            <SongSettings
                settings={settings}
                onTimeSignatureClick={onTimeSignatureClick}
                onSetlistButtonClick={onSetlistButtonClick}
            />
        );
    }

    return child;

    // return (
    //     <div className="song-controls">
    //         {child}
    //     </div>
    // );
}

export default SongControls;