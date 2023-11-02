import {Container} from "react-bootstrap";
import SongEditor from "../song/SongEditor.js";
import {defaultSong} from "../../lib/env.js";
import repository from "../../lib/repository.js";
import {useState} from "react";
import {Song} from "../../types.ts";

export type NewSongEditorContainerProps = {
  onSave: (song: Song) => void
  onCancel: () => void
}

function NewSongEditScreen({onSave, onCancel}: NewSongEditorContainerProps) {
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
                <button className="btn btn-link" onClick={() => onCancel()}>
                    Cancel
                </button>
            </div>
        </Container>
    );

}

export default NewSongEditScreen;
