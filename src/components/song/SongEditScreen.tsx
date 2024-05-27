import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SongEditor from "./SongEditor.js";
import LoadingIndicator from "../common/LoadingIndicator.tsx";
import SongSetlistsEditor from "./SongSetlistsEditor.js";
import repository from "../../lib/repository.js";
import { NewSong, Setlist, Song } from "../../types.ts";
import useParam from "../../lib/use-param.ts";
import Button from "../controls/Button.tsx";
import { defaultSong } from "../../lib/env.ts";
import Screen from "../controls/Screen.tsx";
import FormButtonsGroup from "../controls/FormButtonsGroup.tsx";
import CancelButton from "../controls/CancelButton.tsx";
import { FormattedMessage } from "react-intl";

export default function SongEditScreen() {
  let songId: string | undefined = useParam("id");

  let newSong = false;
  let initialSong = undefined;
  let initialSetlists = undefined;
  if (!songId || songId === "_new_") {
    newSong = true;
    initialSong = defaultSong;
    initialSetlists = [];
    songId = undefined;
  }

  const [song, setSong] = useState<Song | NewSong | undefined>(initialSong);
  const [originalSong, setOriginalSong] = useState(initialSong);
  const [setlists, setSetlists] = useState<Setlist[] | undefined>(
    initialSetlists,
  );
  const [originalSetlists, setOriginalSetlists] = useState<
    Setlist[] | undefined
  >(initialSetlists);

  const [error, setError] = useState();

  useEffect(() => {
    if (songId) {
      setSong(undefined);
      setOriginalSong(undefined);
      setSetlists(undefined);
      repository
        .getSong(songId)
        .then((song) => {
          setSong(song);
          setOriginalSong(song);
        })
        .catch(setError);
      repository
        .getSetlistsWithSong(songId)
        .then((setlists) => {
          setSetlists(setlists);
          setOriginalSetlists(setlists);
        })
        .catch(setError);
    }
  }, [songId]);

  const back = -1;
  const navigate = useNavigate();

  if (error) {
    throw error;
  }

  if (!song || !originalSong || !setlists || !originalSetlists) {
    return <LoadingIndicator />;
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

    navigate(back);
  }

  async function saveAsNew() {
    // TODO
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

  return (
    <Screen name="song-editor" back={back}>
      <h1>
        <FormattedMessage id="song.edit-song" />
      </h1>

      <SongEditor song={song} onChange={setSong} />

      <SongSetlistsEditor setlists={setlists} onChange={setSetlists} />

      <FormButtonsGroup>
        <Button onClick={save} disabled={!song.title}>
          <FormattedMessage id="save" />
        </Button>

        {!newSong && (
          <Button
            variant="secondary"
            onClick={saveAsNew}
            disabled={
              !song.title || song.title.trim() === originalSong.title.trim()
            }
          >
            <FormattedMessage id="song.save-as-new" />
          </Button>
        )}

        <CancelButton back={back} />
      </FormButtonsGroup>
    </Screen>
  );
}
