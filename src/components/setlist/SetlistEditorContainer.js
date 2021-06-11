import {useEffect, useState} from "react";
import songRepository from "../../lib/songRepository";
import LoadingIndicator from "../LoadingIndicator";
import SetlistEditor from "./SetlistEditor";
import {Button, Container} from "react-bootstrap";
import SelectSongContainer from "../song/SelectSongContainer";
import NewSongEditorContainer from "./NewSongEditorContainer";
import {defaultSetlist} from "../../lib/env";

function SetlistEditorContainer({setlistId, onSetlistChange, onCancel}) {
    let newSetlist = false;
    let initialSetlist = null;
    if (!setlistId) {
        newSetlist = true;
        initialSetlist = defaultSetlist;
    }

    const [setlist, setSetlist] = useState(initialSetlist);
    const [originalSetlist, setOriginalSetlist] = useState(initialSetlist);
    const [selectSong, setSelectSong] = useState(false);
    const [addNewSong, setAddNewSong] = useState(false);

    useEffect(() => {
        if (!newSetlist) {
            setSetlist(null);
            songRepository.getSetlist(setlistId).then(setlist => {
                setSetlist(setlist);
                setOriginalSetlist(setlist)
            });
        }
    }, [setlistId, newSetlist])

    if (setlist === null || originalSetlist === null) {
        return <LoadingIndicator/>
    }

    const addSong = song => {
        if (song !== null) {
            //console.log("Song selected:", song);
            setSetlist({
                ...setlist,
                songs: [...(setlist.songs || []), song],
                songIds: [...(setlist.songIds || []), song.id]
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
        .then(onSetlistChange);

    const saveAsNew = () => songRepository.saveSetlist({...setlist, id: null})
        .then(onSetlistChange);

    return (
        <Container className="setlist-editor-screen">
            <h1>
                {newSetlist ? "New Setlist" : "Edit Setlist"}
            </h1>

            <SetlistEditor
                setlist={setlist}
                onChange={setSetlist}
            />

            <div className="form-group">
                <Button variant="secondary" onClick={() => setSelectSong(true)}>
                    Add Song...
                </Button>
                <Button variant="secondary" onClick={() => setAddNewSong(true)}>
                    Add New Song...
                </Button>
            </div>

            <div className="form-group">
                <Button variant="primary" onClick={save} disabled={!setlist.title}>
                    Save
                </Button>

                {!newSetlist &&
                    <Button variant="secondary" onClick={saveAsNew}
                            disabled={!setlist.title || setlist.title === originalSetlist.title}>
                        Save as new
                    </Button>
                }

                <Button variant="link" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </Container>
    );
}

export default SetlistEditorContainer;