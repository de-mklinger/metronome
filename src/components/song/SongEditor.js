import {Link, Redirect} from "react-router-dom";
import songRepository from "../../lib/songRepository";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import LoadingIndicator from "../LoadingIndicator";
import BpmKnob from "../BpmKnob";
import Accents from "./Accents";
import Setlists from "./Setlists";
import TimeSignature from "./TimeSignature";

function SongEditor({song, onSongChange}) {
    const [title, setTitle] = useState(song.title);
    const [bpm, setBpm] = useState(song.bpm);
    const [timeSignatureBeats, setTimeSignatureBeats] = useState(song.timeSignatureBeats);
    const [timeSignatureNoteValue, setTimeSignatureNoteValue] = useState(song.timeSignatureNoteValue);
    const [subDivisions, setSubDivisions] = useState(song.subDivisions);
    const [accents, setAccents] = useState(song.accents);
    const [submitted, setSubmitted] = useState(false);
    const [loadingSetlists, setLoadingSetlists] = useState(false);

    const [setlists, setSetlists] = useState(null);
    const [originalSetlistIds, setOriginalSetlistIds] = useState([]);

    useEffect(
        () => {
            if (song.id && setlists === null && !loadingSetlists && !submitted) {
                songRepository.getSetlistsWithSong(song.id)
                    .then(setlists => {
                        setSetlists(setlists);
                        setOriginalSetlistIds(setlists.map(setlist => setlist.id));
                        setLoadingSetlists(false);
                    });
                setLoadingSetlists(true);
            }

        },
        [song.id, setlists, loadingSetlists, submitted]
    );

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
        .then(async savedSong => {
            originalSetlistIds.forEach(originalSetlistId => {
                if (!setlists.find(setlist => setlist.id === originalSetlistId)) {
                    console.log("Remove from setlist: ", originalSetlistId);
                    songRepository.removeSongFromSetlist(originalSetlistId, savedSong.id);
                }
            });
            return savedSong;
        })
        .then(savedSong => {
            setSubmitted(true);
            onSongChange(savedSong);
        });

    const saveAsNew = () => songRepository.saveSong(toSong(null))
        .then(savedSong => {
            setSubmitted(true);
            onSongChange(savedSong);
        });

    return (
        <Container className="song-editor-screen">
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
                    <Row>
                        <Col>
                            <label htmlFor="bpm">BPM</label>
                            <input type="number" className="form-control" id="bpm" placeholder="Enter BPM"
                                   min={1}
                                   value={bpm}
                                   onChange={e => setBpm(e.target.value)}
                            />
                        </Col>
                        <Col className="speed-knob-col">
                            <BpmKnob
                                bpm={bpm}
                                onBpmChange={setBpm}
                            />
                        </Col>
                    </Row>
                </div>
                <div className="form-group">
                    <label htmlFor="timeSignatureBeats">Time Signature</label>
                    <TimeSignature
                        beats={timeSignatureBeats}
                        noteValue={timeSignatureNoteValue}
                        onBeatsChange={setTimeSignatureBeats}
                        onNoteValueChange={setTimeSignatureNoteValue}
                    />
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
                    <Accents
                        timeSignatureBeats={timeSignatureBeats}
                        accents={accents}
                        onAccentsChange={setAccents}
                    />
                </div>

                {
                    (loadingSetlists || (setlists && setlists.length > 0)) &&
                    <div className="form-group">
                        <label>Setlists</label>
                        { loadingSetlists
                            ?
                            <LoadingIndicator />
                            :
                            <Setlists
                                setlists={setlists}
                                onSetlistsChange={setSetlists}
                            />
                        }
                    </div>
                }

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

export default SongEditor;
