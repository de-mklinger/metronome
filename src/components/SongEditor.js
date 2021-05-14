import {Link} from "react-router-dom";
import songRepository from "../lib/songRepository";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useState} from "react";
import {Redirect} from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";

function SongEditor({song}) {
    const [title, setTitle] = useState(song.title);
    const [bpm, setBpm] = useState(song.bpm);
    const [timeSignatureBeats, setTimeSignatureBeats] = useState(song.timeSignatureBeats);
    const [timeSignatureNoteValue, setTimeSignatureNoteValue] = useState(song.timeSignatureNoteValue);
    const [subDivisions, setSubDivisions] = useState(song.subDivisions);
    const [accents, setAccents] = useState(song.accents);

    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return <Redirect to="/"/>
    }

    const showSaveAsNew = title !== song.title;

    const toSong = (id) => ({
        id: id,
        title: title,
        bpm: bpm,
        timeSignatureBeats: timeSignatureBeats,
        timeSignatureNoteValue: timeSignatureNoteValue,
        subDivisions: subDivisions,
        accents: accents
    });

    const save = () => songRepository.saveSong(toSong(song.id))
        .then(() => setSubmitted(true));

    const saveAsNew = () => songRepository.saveSong(toSong(null))
        .then(() => setSubmitted(true));

    return (
        <Container>
            <h1>Edit Song</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" placeholder="Enter song title"
                           value={title}
                           onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bpm">BPM</label>
                    <input type="number" className="form-control" id="bpm" placeholder="Enter BPM"
                           min={1}
                           value={bpm}
                           onChange={e => setBpm(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <Row>
                        <Col>
                            <label htmlFor="timeSignatureBeats">Beats</label>
                            <input type="number" className="form-control" id="timeSignatureBeats"
                                   min={1} max={16}
                                   list="timeSignatureBeatsList"
                                   pattern="^(?:1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16)$"
                                   placeholder="Enter beats"
                                   value={timeSignatureBeats}
                                   onChange={e => setTimeSignatureBeats(e.target.value)}
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
                        <Col>
                            <label htmlFor="timeSignatureNoteValue">Note Value</label>
                            <input type="number" className="form-control" id="timeSignatureNoteValue"
                                   min={1} max={8}
                                   list="timeSignatureNoteValueList"
                                   pattern="^(?:1|2|4|8)$"
                                   placeholder="Enter note value"
                                   value={timeSignatureNoteValue}
                                   onChange={e => setTimeSignatureNoteValue(e.target.value)}
                            />
                            <datalist id="timeSignatureNoteValueList">
                                <option>1</option>
                                <option>2</option>
                                <option>4</option>
                                <option>8</option>
                            </datalist>
                        </Col>
                    </Row>
                </div>
                <div className="form-group">
                    <label htmlFor="bpm">subDivisions</label>
                    <input type="number" className="form-control" id="subDivisions" placeholder="Enter subDivisions"
                           value={subDivisions}
                           onChange={e => setSubDivisions(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="accent0">Accents</label>
                    <Accents timeSignatureBeats={timeSignatureBeats} accents={accents}/>
                </div>

                <div className="form-group">
                    <label>Setlists</label>
                    <Setlists songId={song.id} />
                </div>

                <Button className="btn-primary" onClick={save}>Save</Button>

                {
                    showSaveAsNew &&
                    <Button className="btn-secondary" onClick={saveAsNew}>Save as new</Button>
                }

                <Link to="/" className="btn btn-link">Cancel</Link>

            </form>
        </Container>
    );
}

function Accents({timeSignatureBeats, accents, onAccentsChange}) {
    let normalizedActions = [];
    while (normalizedActions.length < timeSignatureBeats) {
        let idx = normalizedActions.length;
        if (accents.length > idx) {
            normalizedActions.push(accents[idx]);
        } else {
            normalizedActions.push(1);
        }
    }

    return (
            <Row>
                {normalizedActions.map((accent, idx) =>
                    <Col key={idx}>
                        <input type="number" className="form-control" id={"accent" + idx} placeholder="Accent"
                               min={1} max={3}
                               defaultValue={normalizedActions[idx]}/>
                    </Col>
                )}
            </Row>
    );
}

function Setlists({songId, onSetlistsChange}) {
    const [setlists, setSetlists] = useState(null);

    if (setlists === null) {
        songRepository.getSetlistsWithSong(songId)
            .then(setSetlists);
        return <LoadingIndicator />
    } else {
        return <ul>
            {setlists.map(setlist =>
                <li>
                    {setlist.title}
                </li>
            )}
        </ul>
    }
}

export default SongEditor;
