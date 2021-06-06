import {Link, Redirect, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import songRepository from "../../lib/songRepository";
import SongEditor from "./SongEditor";
import LoadingIndicator from "../LoadingIndicator";
import {Button, Container} from "react-bootstrap";
import SongSetlistsEditor from "./SongSetlistsEditor";

function SongEditorContainer({onSongChange, onSetlistChange}) {
    let {id} = useParams();
    id = decodeURIComponent(id); // TODO no way to automatically decode??

    const [song, setSong] = useState(null);
    const [setlists, setSetlists] = useState(null);
    const [originalSetlists, setOriginalSetlists] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setSong(null);
        setSetlists(null);
        songRepository.getSong(id).then(setSong);
        songRepository.getSetlistsWithSong(id).then(setlists => {
            setSetlists(setlists);
            setOriginalSetlists(setlists);
        });
    }, [id])

    if (song === null || setlists === null || originalSetlists === null) {
        return <LoadingIndicator />
    }

    if (submitted) {
        return <Redirect to="/"/>
    }

    const save = () => songRepository.saveSong(song)
        .then(savedSong => {
            const removedSetlists = originalSetlists.filter(originalSetlist =>
                !setlists.find(setlist => setlist.id === originalSetlist.id)
            );
            console.log("removed setlists: ", removedSetlists);

            return Promise.all(
                removedSetlists.map(setlist =>
                    songRepository.removeSongFromSetlist(setlist.id, savedSong.id))
            ).then(savedSetlists => [savedSong, savedSetlists]);

        })
        .then(([savedSong, savedSetlists]) => {
            setSubmitted(true);
            onSongChange(savedSong);
            savedSetlists.forEach(onSetlistChange);
        });

    const saveAsNew = () => songRepository.saveSong({...song, id: null})
        .then(savedSong => {
            return Promise.all(
                setlists
                    .map(setlist => {
                        console.log("Add to setlist: ", setlist);
                        return songRepository.addSongToSetlist(setlist.id, savedSong.id)
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
                <Button className="btn-primary" onClick={save}>
                    Save
                </Button>

                <Button className="btn-secondary" onClick={saveAsNew}>
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