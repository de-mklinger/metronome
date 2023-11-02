import {Link, Redirect} from "react-router-dom";
import {useEffect, useState} from "react";
import SongEditor from "./SongEditor.js";
import LoadingIndicator from "../LoadingIndicator.js";
import {Button, Container} from "react-bootstrap";
import SongSetlistsEditor from "./SongSetlistsEditor.js";
import repository from "../../lib/repository.js";
import EqualWidthFormGroup from "../EqualWidthFormGroup.js";
import {Setlist, SetlistWithSongs, Song} from "../../types.ts";
import useParam from "../../lib/use-param.ts";

export type SongEditorContainerProps = {
  onSongChange: (song: Song) => void,
  onSetlistChange: (setlist: SetlistWithSongs) => void
}

function SongEditorContainer({onSongChange, onSetlistChange}: SongEditorContainerProps) {
    const id = useParam("id");

    const [song, setSong] = useState<Song>();
    const [originalSong, setOriginalSong] = useState<Song>();
    const [setlists, setSetlists] = useState<Setlist[]>();
    const [originalSetlists, setOriginalSetlists] = useState<Setlist[]>();
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setSong(undefined);
        setOriginalSong(undefined);
        setSetlists(undefined);
        repository.getSong(id).then(song => {
            setSong(song);
            setOriginalSong(song);
        });
        repository.getSetlistsWithSong(id).then(setlists => {
            setSetlists(setlists);
            setOriginalSetlists(setlists);
        });
    }, [id])

    if (!song || !originalSong || !setlists || !originalSetlists) {
        return <LoadingIndicator />
    }

    if (submitted) {
        return <Redirect to="/"/>
    }

    async function save() {
      if (!song) {
        throw new Error();
      }

      const savedSong = await repository.saveSong(song);
      onSongChange(savedSong);

      const removedSetlists = (originalSetlists ?? []).filter(originalSetlist =>
        !(setlists ?? []).find(setlist => setlist.id === originalSetlist.id)
      );

      const savedSetlists = await Promise.all(
        removedSetlists.map(setlist =>
          repository.removeSongFromSetlist(setlist.id, savedSong.id))
      );
      savedSetlists.forEach(onSetlistChange);

      setSubmitted(true);
    }

    async function saveAsNew() {
      if (!song) {
        throw new Error();
      }

      const savedSong = await repository.saveSong(song);
      onSongChange(savedSong);

      if (setlists) {
        const savedSetlists = await Promise.all(
          setlists.map(setlist => repository.addSongToSetlist(setlist.id, savedSong.id))
        );
        savedSetlists.forEach(onSetlistChange);
      }

      setSubmitted(true);
    }

    // TODO in progress state
    if (!song) {
      return (
        <Container className="song-editor-screen">
          <h1>Edit Song</h1>
          <LoadingIndicator />
        </Container>
        )
    }

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

            <EqualWidthFormGroup>
                <Button className="btn-primary" onClick={save} disabled={!song.title}>
                    Save
                </Button>

                <Button className="btn-secondary" onClick={saveAsNew} disabled={!song.title || song.title.trim() === originalSong.title.trim()}>
                    As New
                </Button>

                <Link to="/" className="btn btn-link">
                    Cancel
                </Link>
            </EqualWidthFormGroup>
        </Container>
    );
}


export default SongEditorContainer;
