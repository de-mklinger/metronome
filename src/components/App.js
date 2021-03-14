import {useState} from 'react';
import './Metronome';
import Metronome from "./Metronome";
import './InputSpinner';
import './TimeSignatureModal'
import TimeSignatureModal from "./TimeSignatureModal";

function App(props) {
    const [editTimeSignature, setEditTimeSignature] = useState(false);

    const handleClose = () => setEditTimeSignature(false);
    const handleShow = () => setEditTimeSignature(true);

    return (
            <>
                <Metronome
                    ctx={props.ctx}
                    onPlay={props.onPlay}
                    onBpmChange={props.onBpmChange}
                    onTimeSignatureClick={handleShow}
                    onSongSelect={props.onSongSelect}
                />

                <TimeSignatureModal
                    show={editTimeSignature}
                    onHide={handleClose}
                    timeSignatureBeats={props.ctx.settings.timeSignatureBeats}
                    onTimeSignatureBeatsChange={props.onTimeSignatureBeatsChange}
                    timeSignatureNoteValue={props.ctx.settings.timeSignatureNoteValue}
                    onTimeSignatureNoteValueChange={props.onTimeSignatureNoteValueChange}
                />
            </>
        );
}

export default App;
