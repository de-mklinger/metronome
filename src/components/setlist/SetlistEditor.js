import {Button, Container} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";
import {useState} from "react";
import Songs from "./Songs";
import songRepository from "../../lib/songRepository";

function SetlistEditor({setlist, onSetlistChange}) {
    const [title, setTitle] = useState(setlist.title);
    const [songs, setSongs] = useState(setlist.songs);
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return <Redirect to="/setlists"/>
    }

    const showSaveAsNew = title !== setlist.title;

    const toSetlist = (id) => ({
        id: id,
        title: title,
        songIds: songs.map(song => song.id),
        songs: songs
    });

    const save = () => songRepository.saveSetlist(toSetlist(setlist.id))
        .then(savedSetlist => {
            setSubmitted(true);
            onSetlistChange(savedSetlist);
        });

    const saveAsNew = () => songRepository.saveSetlist(toSetlist(null))
        .then(savedSetlist => {
            setSubmitted(true);
            onSetlistChange(savedSetlist);
        });

    return (
        <Container className="setlist-editor-screen">
            <h1>Edit Setlist</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" placeholder="Enter song title"
                           value={title}
                           onChange={e => setTitle(e.target.value)}
                    />
                </div>

                {
                    songs && songs.length > 0 &&
                    <div className="form-group">
                        <label>Songs</label>
                        <Songs
                            songs={songs}
                            onSongsChange={setSongs}
                        />
                        <Button>Add...</Button>
                    </div>
                }


                <Button className="btn-primary" onClick={save}>Save</Button>

                {
                    showSaveAsNew &&
                    <Button className="btn-secondary" onClick={saveAsNew}>Save as new</Button>
                }

                <Link to="/setlists" className="btn btn-link">Cancel</Link>

            </form>
        </Container>
    );
}

export default SetlistEditor;