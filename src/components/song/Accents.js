import {Col, Row} from "react-bootstrap";

function Accents({accents, timeSignatureBeats, onAccentsChange}) {
    let normalizedActions = [];
    while (normalizedActions.length < timeSignatureBeats) {
        let idx = normalizedActions.length;
        if (accents.length > idx) {
            normalizedActions.push(accents[idx]);
        } else {
            normalizedActions.push(1);
        }
    }

    const handleAccentChange = (idx, e) => {
        const newAccents = Array.from(normalizedActions);
        newAccents[idx] = e.target.value;
        onAccentsChange(newAccents);
    };

    return (
        <Row>
            {normalizedActions.map((accent, idx) =>
                <Col key={idx}>
                    <input type="number" className="form-control" id={"accent" + idx} placeholder="Accent"
                           min={1} max={3}
                           value={normalizedActions[idx]}
                           onChange={e => handleAccentChange(idx, e)}
                    />
                </Col>
            )}
        </Row>
    );
}

export default Accents;