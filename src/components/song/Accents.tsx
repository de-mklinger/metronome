import {Col, Row} from "react-bootstrap";
import {ChangeEvent} from "react";
import {Accent, isAccent} from "../../types.ts";

export type AccentsProps = {
    accents: Accent[],
    timeSignatureBeats: number,
    onAccentsChange: (newAccents: Accent[]) => void
}

function Accents({accents, timeSignatureBeats, onAccentsChange}: AccentsProps) {
    let normalizedAccents: Accent[] = [];
    while (normalizedAccents.length < timeSignatureBeats) {
        let idx = normalizedAccents.length;
        if (accents.length > idx) {
            normalizedAccents.push(accents[idx]);
        } else {
            normalizedAccents.push(1);
        }
    }

    const handleAccentChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
        const newAccents = Array.from(normalizedAccents);
        const newAccent = parseInt(e.target.value, 10);
        if (isAccent(newAccent)) {
            newAccents[idx] = newAccent;
        }
        onAccentsChange(newAccents);
    };

    return (
        <Row>
            {normalizedAccents.map((accent, idx) =>
                <Col key={idx}>
                    <input type="number" className="form-control" id={"accent" + idx} placeholder="Accent"
                           min={1} max={3}
                           value={accent}
                           onChange={e => handleAccentChange(idx, e)}
                    />
                </Col>
            )}
        </Row>
    );
}

export default Accents;
