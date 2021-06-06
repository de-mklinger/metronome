import {Link, Redirect, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import songRepository from "../../lib/songRepository";
import LoadingIndicator from "../LoadingIndicator";
import SetlistEditor from "./SetlistEditor";
import {Button, Container} from "react-bootstrap";
import SelectSongContainer from "../song/SelectSongContainer";
import NewSongEditorContainer from "./NewSongEditorContainer";

function SetlistEditorContainer({onSetlistChange}) {
    let {id} = useParams();
    id = decodeURIComponent(id); // TODO no way to automatically decode??

    const [setlist, setSetlist] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [selectSong, setSelectSong] = useState(false);
    const [addNewSong, setAddNewSong] = useState(false);

    useEffect(() => {
        setSetlist(null);
        songRepository.getSetlist(id).then(setSetlist);
    }, [id])

    if (setlist === null) {
        return <LoadingIndicator/>
    }

    if (submitted) {
        return <Redirect to="/"/>
    }

    const addSong = song => {
        if (song !== null) {
            console.log("Song selected:", song);
            setSetlist({
                ...setlist,
                songs: [...setlist.songs, song],
                songIds: [...setlist.songIds, song.id]
            });
        }
    };

    if (selectSong) {
        return (
            <SelectSongContainer
                onSelect={song => {
                    addSong(song);
                    setSelectSong(false);
                }}
            />
        );
    }

    if (addNewSong) {
        return (
            <NewSongEditorContainer
                onSave={song => {
                    addSong(song);
                    setAddNewSong(false);
                }}
            />
        );
    }

    const save = () => songRepository.saveSetlist(setlist)
        .then(savedSetlist => {
            setSubmitted(true);
            onSetlistChange(savedSetlist);
        });

    const saveAsNew = () => songRepository.saveSetlist({...setlist, id: null})
        .then(savedSetlist => {
            setSubmitted(true);
            onSetlistChange(savedSetlist);
        });

    return (
        <Container className="setlist-editor-screen">
            <h1>Edit Setlist</h1>

            <SetlistEditor
                setlist={setlist}
                onChange={setSetlist}
            />

            <div className="form-group">
                <Button onClick={() => setSelectSong(true)}>
                    Add Song...
                </Button>
                <Button onClick={() => setAddNewSong(true)}>
                    Add New Song...
                </Button>
            </div>

            <div className="form-group">
                <Button className="btn-primary" onClick={save}>Save</Button>

                {/*{*/}
                {/*    showSaveAsNew &&*/}
                <Button className="btn-secondary" onClick={saveAsNew}>Save as new</Button>
                {/*}*/}

                <Link to="/setlists" className="btn btn-link">Cancel</Link>
            </div>
        </Container>
    );
}

export default SetlistEditorContainer;