import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import songRepository from "../lib/songRepository";
import LoadingIndicator from "./LoadingIndicator";

function SelectSetlistModal({show, onHide, onSetlistSelect}) {
    const [setlists, setSetlists] = useState(null);

    let body;

    if (setlists === null) {
        songRepository.getSetlists().then(setSetlists);
        body = <LoadingIndicator/>
    } else {
        body = (
            <div className="setlist">
                <div>
                    <Button onClick={() => onSetlistSelect(null)}>
                        None
                    </Button>
                </div>
                {setlists.map(setlist =>
                    <div key={setlist.id}>
                        <Button onClick={() => onSetlistSelect(setlist.id)}>
                            {setlist.title}
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Setlist</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center my-3">
                {body}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SelectSetlistModal;