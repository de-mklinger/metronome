import {Container} from "react-bootstrap";
import SongEditor from "../song/SongEditor";
import {defaultSong} from "../../lib/env";
import {useState} from "react";
import songRepository from "../../lib/songRepository";

function NewSongEditorContainer({onSave}) {
    const [song, setSong] = useState(defaultSong);

    const save = () => songRepository.saveSong(song)
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