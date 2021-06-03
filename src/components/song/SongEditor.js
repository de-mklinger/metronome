import {Col, Row} from "react-bootstrap";
import BpmKnob from "../BpmKnob";
import Accents from "./Accents";
import TimeSignature from "./TimeSignature";

function SongEditor({song, onChange}) {
    const fireChange = (attributeName, attributeValue) => {
        let changedSong = { ...song };
        changedSong[attributeName] = attributeValue;
        onChange(changedSong);
    }

    return (
        <>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" className="form-control" id="title" placeholder="Enter song title"
                       value={song.title}
                       onChange={e => fireChange("title", e.target.value)}
                />
            </div>
            <div className="form-group">
                <Row>
                    <Col>
                        <label htmlFor="bpm">BPM</label>
                        <input type="number" className="form-control" id="bpm" placeholder="Enter BPM"
                               min={1}
                               value={song.bpm}
                               onChange={e => fireChange("bpm", e.target.value)}
                        />
                    </Col>
                    <Col className="speed-knob-col">
                        <BpmKnob
                            bpm={song.bpm}
                            onBpmChange={bpm => fireChange("bpm", bpm)}
                        />
                    </Col>
                </Row>
            </div>
            <div className="form-group">
                <label htmlFor="timeSignatureBeats">Time Signature</label>
                <TimeSignature
                    beats={song.timeSignatureBeats}
                    noteValue={song.timeSignatureNoteValue}
                    onBeatsChange={beats => fireChange("timeSignatureBeats", beats)}
                    onNoteValueChange={noteValue => fireChange("timeSignatureNoteValue", noteValue)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="bpm">subDivisions</label>
                <input type="number" className="form-control" id="subDivisions" placeholder="Enter subDivisions"
                       value={song.subDivisions}
                       onChange={e => fireChange("subDivisions", e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="accent0">Accents</label>
                <Accents
                    timeSignatureBeats={song.timeSignatureBeats}
                    accents={song.accents}
                    onAccentsChange={accents => fireChange("accents", accents)}
                />
            </div>
        </>
    );
}

export default SongEditor;
