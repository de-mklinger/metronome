import {Container} from "react-bootstrap";
import SongEditor from "../song/SongEditor";
import {defaultSong} from "../../lib/env";
import repository from "../../lib/repository";
import {useState} from "react";

function NewSongEditorContainer({onSave}) {
    const [song, setSong] = useState(defaultSong);

    const save = () => repository.saveSong(song)
        .then(savedSong => {
            onSave(savedSong);
        });

    return (
        <Container className="song-editor-screen">
            <h1>Add New Song</h1>

            <SongEditor song={song} onChange={setSong} />

            <div className="form-group">
                <button className="btn btn-primary" onClick={() => save()}>
                    Save
                </button>
                <button className="btn btn-link" onClick={() => onSave(null)}>
                    Cancel
                </button>
            </div>
        </Container>
    );

}

export default NewSongEditorContainer;