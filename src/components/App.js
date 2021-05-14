import {useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Metronome from "./Metronome";
import TimeSignatureModal from "./TimeSignatureModal";
import SelectSetlistModal from "./SelectSetlistModal";
import SongEditorContainer from "./SongEditorContainer";

function App(props) {
    const [editTimeSignature, setEditTimeSignature] = useState(false);
    const [selectSetlist, setSelectSetlist] = useState(false);

    return (
        <Router>
            <Switch>
                <Route path="/songs/:id">
                    <SongEditorContainer />
                </Route>
                <Route path="/">
                    <Metronome
                        ctx={props.ctx}
                        onPlay={props.onPlay}
                        onBpmChange={props.onBpmChange}
                        onTimeSignatureClick={() => setEditTimeSignature(true)}
                        onSongSelect={props.onSongSelect}
                        onSetlistDeselect={() => props.onSetlistSelect(null)}
                        onSetlistButtonClick={() => setSelectSetlist(true)}
                    />

                    <TimeSignatureModal
                        show={editTimeSignature}
                        onHide={() => setEditTimeSignature(false)}
                        timeSignatureBeats={props.ctx.settings.timeSignatureBeats}
                        onTimeSignatureBeatsChange={props.onTimeSignatureBeatsChange}
                        timeSignatureNoteValue={props.ctx.settings.timeSignatureNoteValue}
                        onTimeSignatureNoteValueChange={props.onTimeSignatureNoteValueChange}
                    />

                    <SelectSetlistModal
                        show={selectSetlist}
                        onHide={() => setSelectSetlist(false)}
                        onSetlistSelect={(setlistId) => {
                            props.onSetlistSelect(setlistId);
                            setSelectSetlist(false);
                        }}
                    />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
