import {useEffect, useState} from "react";
import LoadingIndicator from "../LoadingIndicator.tsx";
import SetlistEditor from "./SetlistEditor.tsx";
import {Button, Container} from "react-bootstrap";
import SelectSongContainer from "../song/SelectSongContainer.tsx";
import NewSongEditorContainer from "./NewSongEditorContainer.tsx";
import {defaultSetlist} from "../../lib/env.js";
import repository from "../../lib/repository.js";
import EqualWidthFormGroup from "../EqualWidthFormGroup.tsx";
import {SetlistWithSongs, Song, toNewSetlist} from "../../types.ts";

export type SetlistEditorContainerProps = {
    setlistId?: string,
    onSetlistChange: (setlist: SetlistWithSongs) => void,
    onCancel: () => void
}

function SetlistEditorContainer({setlistId, onSetlistChange, onCancel}: SetlistEditorContainerProps) {
    let newSetlist = false;
    let initialSetlist = undefined;
    if (!setlistId) {
        newSetlist = true;
        initialSetlist = defaultSetlist;
    }

    const [setlist, setSetlist] = useState<SetlistWithSongs | undefined>(initialSetlist);
    const [originalSetlist, setOriginalSetlist] = useState(initialSetlist);
    const [selectSong, setSelectSong] = useState(false);
    const [addNewSong, setAddNewSong] = useState(false);

    useEffect(() => {
        if (setlistId) {
            setSetlist(undefined);
            repository.getSetlist(setlistId).then(setlist => {
                setSetlist(setlist);
                setOriginalSetlist(setlist)
            });
        }
    }, [setlistId])

    if (!setlist || !originalSetlist) {
        return <LoadingIndicator/>
    }

    const addSong = (song: Song) => {
            //console.log("Song selected:", song);
            setSetlist({
                ...setlist,
                songs: [...(setlist.songs || []), song],
                songIds: [...(setlist.songIds || []), song.id]
            });
    };

    if (selectSong) {
        return (
            <SelectSongContainer
                onSelect={song => {
                    addSong(song);
                    setSelectSong(false);
                }}
                onCancel={() => {
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
                onCancel={() => {
                    setAddNewSong(false);
                }}
            />
        );
    }

    const save = () => repository.saveSetlist(setlist)
        .then(onSetlistChange);

    const saveAsNew = () => repository.saveSetlist(toNewSetlist(setlist))
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

            <EqualWidthFormGroup>
                <Button variant="secondary" onClick={() => setSelectSong(true)}>
                    Add Song...
                </Button>
                <Button variant="secondary" onClick={() => setAddNewSong(true)}>
                    Add New Song...
                </Button>
            </EqualWidthFormGroup>

            <EqualWidthFormGroup>
                <Button variant="primary" onClick={save} disabled={!setlist.title}>
                    Save
                </Button>

                {!newSetlist &&
                    <Button variant="secondary" onClick={saveAsNew}
                            disabled={!setlist.title || setlist.title === originalSetlist.title}>
                        <span>
                            As New
                        </span>
                    </Button>
                }

                <Button variant="link" onClick={onCancel}>
                    Cancel
                </Button>
            </EqualWidthFormGroup>
        </Container>
    );
}

export default SetlistEditorContainer;
