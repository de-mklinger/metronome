import {Col, Row} from "react-bootstrap";
import {
    isTimeSignatureBeats,
    isTimeSignatureNoteValue,
    TimeSignatureBeats,
    TimeSignatureNoteValue
} from "../../types.ts";
import {ChangeEvent} from "react";

export type TimeSignatureProps = {
    beats: TimeSignatureBeats,
    noteValue: TimeSignatureNoteValue,
    onBeatsChange: (newBeats: TimeSignatureBeats) => void,
    onNoteValueChange: (newNoteValue: TimeSignatureNoteValue) => void
}

function TimeSignature({beats, noteValue, onBeatsChange, onNoteValueChange}: TimeSignatureProps) {
    function handleBeatsChange(e: ChangeEvent<HTMLInputElement>) {
        const v = parseInt(e.target.value);
        if (isTimeSignatureBeats(v)) {
            onBeatsChange(v);
        }
    }

    function handleNoteValueChange(e: ChangeEvent<HTMLInputElement>) {
        const v = parseInt(e.target.value);
        if (isTimeSignatureNoteValue(v)) {
            onNoteValueChange(v);
        }
    }

    return (
        <Row>
            <Col>
                <input type="number" className="form-control" id="timeSignatureBeats"
                       min={1} max={16}
                       list="timeSignatureBeatsList"
                       pattern="^(?:1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16)$"
                       placeholder="Enter beats"
                       value={beats}
                       onChange={handleBeatsChange}
                />
                <datalist id="timeSignatureBeatsList">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                    <option>11</option>
                    <option>12</option>
                    <option>13</option>
                    <option>14</option>
                    <option>15</option>
                    <option>16</option>
                </datalist>
            </Col>
            <Col className="time-signature-slash-col">
                /
            </Col>
            <Col>
                <input type="number" className="form-control" id="timeSignatureNoteValue"
                       min={1} max={8}
                       list="timeSignatureNoteValueList"
                       pattern="^(?:1|2|4|8)$"
                       placeholder="Enter note value"
                       value={noteValue}
                       onChange={handleNoteValueChange}
                />
                <datalist id="timeSignatureNoteValueList">
                    <option>1</option>
                    <option>2</option>
                    <option>4</option>
                    <option>8</option>
                </datalist>
            </Col>
        </Row>
    );
}

export default TimeSignature;
