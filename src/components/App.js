import {useState} from 'react';
import Metronome from "./Metronome";
import TimeSignatureModal from "./TimeSignatureModal";
import SelectSetlistModal from "./SelectSetlistModal";
import songRepository from "../lib/songRepository";

function App(props) {
    const [editTimeSignature, setEditTimeSignature] = useState(false);
    const [selectSetlist, setSelectSetlist] = useState(false);

    return (
            <>
                <Metronome
                    ctx={props.ctx}
                    onPlay={props.onPlay}
                    onBpmChange={props.onBpmChange}
                    onTimeSignatureClick={() => setEditTimeSignature(true)}
                    onSongSelect={props.onSongSelect}
                    onSetlistDeselect={() => props.onSetlistSelect(null)}
                    onSetlistButtonClick={() => setSelectSetlist(true)}
                />

                <TimeSignatureModal
                    show={editTimeSignature}
                    onHide={() => setEditTimeSignature(false)}
                    timeSignatureBeats={props.ctx.settings.timeSignatureBeats}
                    onTimeSignatureBeatsChange={props.onTimeSignatureBeatsChange}
                    timeSignatureNoteValue={props.ctx.settings.timeSignatureNoteValue}
                    onTimeSignatureNoteValueChange={props.onTimeSignatureNoteValueChange}
                />

                <SelectSetlistModal
                    show={selectSetlist}
                    onHide={() => setSelectSetlist(false)}
                    setlists={songRepository.getSetlists()}
                    onSetlistSelect={(setlistId) => {
                        props.onSetlistSelect(setlistId);
                        setSelectSetlist(false);
                    }}
                />
            </>
        );
}

export default App;
