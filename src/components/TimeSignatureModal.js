import Modal from "react-bootstrap/Modal";
import InputSpinner from "./InputSpinner";
import Button from "react-bootstrap/Button";
import {useState} from "react";

function TimeSignatureModal(props) {
    const minTimeSignatureBeats = 1;
    const maxTimeSignatureBeats = 16;

    const [timeSignatureBeats, setTimeSignatureBeats] = useState(props.timeSignatureBeats);

    const handleTimeSignatureBeatsChange = e => {
        let newValue = e.target.value;
        newValue = Math.max(newValue, minTimeSignatureBeats);
        newValue = Math.min(newValue, maxTimeSignatureBeats);

        if (newValue === timeSignatureBeats) {
            return;
        }

        setTimeSignatureBeats(newValue);
        props.onTimeSignatureBeatsChange(newValue);
    }

    const minTimeSignatureNoteValue = 1;
    const maxTimeSignatureNoteValue = 32;

    const [timeSignatureNoteValue, setTimeSignatureNoteValue] = useState(props.timeSignatureNoteValue);

    const isPowerOfTwo = n => Number.isInteger(Math.log2(n));

    const handleTimeSignatureNoteValueChange = e => {
        let newValue = e.target.value;
        newValue = Math.max(newValue, minTimeSignatureNoteValue);
        newValue = Math.min(newValue, maxTimeSignatureNoteValue);

        const oldValue = timeSignatureNoteValue;

        if (newValue === oldValue) {
            return;
        } else if (!isPowerOfTwo(newValue)) {
            let goingUp = newValue > oldValue
            if (goingUp) {
                newValue = Math.min(oldValue * 2, maxTimeSignatureNoteValue);
            } else {
                newValue = Math.max(oldValue / 2, minTimeSignatureNoteValue);
            }
        }

        setTimeSignatureNoteValue(newValue);
        props.onTimeSignatureNoteValueChange(newValue);
    }

    return (
        <Modal show={props.show} onHide={props.onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Time Signature</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center my-3">
                <InputSpinner
                    min={minTimeSignatureBeats}
                    max={maxTimeSignatureBeats}
                    value={timeSignatureBeats}
                    onChange={handleTimeSignatureBeatsChange}
                />
                <span> / </span>
                <InputSpinner
                    min={minTimeSignatureNoteValue}
                    max={maxTimeSignatureNoteValue}
                    value={timeSignatureNoteValue}
                    onChange={handleTimeSignatureNoteValueChange}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TimeSignatureModal;