import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function SelectSetlistModal({show, onHide, setlists}) {

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Setlist</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center my-3">

                <div>
                    <Button>None</Button>
                </div>
                {setlists.map(setlist =>
                    <div>
                        <Button>{setlist.title}</Button>
                    </div>
                )}

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