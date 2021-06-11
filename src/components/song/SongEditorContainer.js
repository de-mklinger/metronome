import {Link, Redirect, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import SongEditor from "./SongEditor";
import LoadingIndicator from "../LoadingIndicator";
import {Button, Container} from "react-bootstrap";
import SongSetlistsEditor from "./SongSetlistsEditor";
import repository from "../../lib/repository";

function SongEditorContainer({onSongChange, onSetlistChange}) {
    let {id} = useParams();
    id = decodeURIComponent(id); // TODO no way to automatically decode??

    const [song, setSong] = useState(null);
    const [originalSong, setOriginalSong] = useState(null);
    const [setlists, setSetlists] = useState(null);
    const [originalSetlists, setOriginalSetlists] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setSong(null);
        setOriginalSong(null);
        setSetlists(null);
        repository.getSong(id).then(song => {
            setSong(song);
            setOriginalSong(song);
        });
        repository.getSetlistsWithSong(id).then(setlists => {
            setSetlists(setlists);
            setOriginalSetlists(setlists);
        });
    }, [id])

    if (song === null || originalSong === null || setlists === null || originalSetlists === null) {
        return <LoadingIndicator />
    }

    if (submitted) {
        return <Redirect to="/"/>
    }

    const save = () => repository.saveSong(song)
        .then(savedSong => {
            const removedSetlists = originalSetlists.filter(originalSetlist =>
                !setlists.find(setlist => setlist.id === originalSetlist.id)
            );
            //console.log("removed setlists: ", removedSetlists);

            return Promise.all(
                removedSetlists.map(setlist =>
                    repository.removeSongFromSetlist(setlist.id, savedSong.id))
            ).then(savedSetlists => [savedSong, savedSetlists]);

        })
        .then(([savedSong, savedSetlists]) => {
            setSubmitted(true);
            onSongChange(savedSong);
            savedSetlists.forEach(onSetlistChange);
        });

    const saveAsNew = () => repository.saveSong({...song, id: null})
        .then(savedSong => {
            return Promise.all(
                setlists
                    .map(setlist => {
                        //console.log("Add to setlist: ", setlist);
                        return repository.addSongToSetlist(setlist.id, savedSong.id)
                            .then(onSetlistChange)
                    })
            ).then(() => savedSong);
        })
        .then(savedSong => {
            setSubmitted(true);
            onSongChange(savedSong);
        });

    return (
        <Container className="song-editor-screen">
            <h1>Edit Song</h1>

            <SongEditor
                song={song}
                onChange={setSong}
            />

            <SongSetlistsEditor
                setlists={setlists}
                onChange={setSetlists}
            />

            <div className="form-group">
                <Button className="btn-primary" onClick={save} disabled={!song.title}>
                    Save
                </Button>

                <Button className="btn-secondary" onClick={saveAsNew} disabled={!song.title || song.title.trim() === originalSong.title.trim()}>
                    Save as new
                </Button>

                <Link to="/" className="btn btn-link">
                    Cancel
                </Link>
            </div>
        </Container>
    );
}


export default SongEditorContainer;