import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SongEditor from "./SongEditor.js";
import LoadingIndicator from "../common/LoadingIndicator.tsx";
import SongSetlistsEditor from "./SongSetlistsEditor.js";
import repository from "../../lib/repository.js";
import EqualWidthFormGroup from "../common/EqualWidthFormGroup.tsx";
import { Setlist, Song } from "../../types.ts";
import useParam from "../../lib/use-param.ts";
import Button from "../controls/Button.tsx";
import Container from "../controls/Container.tsx";

function SongEditScreen() {
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
    repository.getSong(id).then((song) => {
      setSong(song);
      setOriginalSong(song);
    });
    repository.getSetlistsWithSong(id).then((setlists) => {
      setSetlists(setlists);
      setOriginalSetlists(setlists);
    });
  }, [id]);

  const navigate = useNavigate();

  if (!song || !originalSong || !setlists || !originalSetlists) {
    return <LoadingIndicator />;
  }

  if (submitted) {
    navigate(-1);
    return <></>;
  }

  async function save() {
    if (!song) {
      throw new Error();
    }

    const savedSong = await repository.saveSong(song);
    // TODO
    // onSongChange(savedSong);

    const removedSetlists = (originalSetlists ?? []).filter(
      (originalSetlist) =>
        !(setlists ?? []).find((setlist) => setlist.id === originalSetlist.id),
    );

    const savedSetlists = await Promise.all(
      removedSetlists.map((setlist) =>
        repository.removeSongFromSetlist(setlist.id, savedSong.id),
      ),
    );
    // TODO
    // savedSetlists.forEach(onSetlistChange);
    console.log("savedSetlists:", savedSetlists);

    setSubmitted(true);
  }

  async function saveAsNew() {
    // if (!song) {
    //   throw new Error();
    // }
    //
    // const savedSong = await repository.saveSong(song);
    // onSongChange(savedSong);
    //
    // if (setlists) {
    //   const savedSetlists = await Promise.all(
    //     setlists.map((setlist) =>
    //       repository.addSongToSetlist(setlist.id, savedSong.id),
    //     ),
    //   );
    //   savedSetlists.forEach(onSetlistChange);
    // }
    //
    // setSubmitted(true);
  }

  // TODO in progress state
  if (!song) {
    return (
      <Container className="song-editor-screen">
        <h1>Edit Song</h1>
        <LoadingIndicator />
      </Container>
    );
  }

  return (
    <Container className="song-editor-screen">
      <h1>Edit Song</h1>

      <SongEditor song={song} onChange={setSong} />

      <SongSetlistsEditor setlists={setlists} onChange={setSetlists} />

      <EqualWidthFormGroup>
        <Button onClick={save} disabled={!song.title}>
          Save
        </Button>

        <Button
          variant="secondary"
          onClick={saveAsNew}
          disabled={
            !song.title || song.title.trim() === originalSong.title.trim()
          }
        >
          As New
        </Button>

        <Link to="/" className="btn btn-link">
          Cancel
        </Link>
      </EqualWidthFormGroup>
    </Container>
  );
}

export default SongEditScreen;
