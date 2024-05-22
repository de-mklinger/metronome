import { useEffect, useState } from "react";
import LoadingIndicator from "../common/LoadingIndicator.tsx";
import SetlistEditView from "./SetlistEditView.tsx";
import SelectSongScreen from "../song/SelectSongScreen.tsx";
import NewSongEditScreen from "./NewSongEditScreen.tsx";
import { defaultSetlist } from "../../lib/env.js";
import repository from "../../lib/repository.js";
import {
  NewSetlistWithSongs,
  SetlistWithSongs,
  Song,
  toNewSetlist,
} from "../../types.ts";
import Button from "../controls/Button.tsx";
import Screen from "../controls/Screen.tsx";
import useParam from "../../lib/use-param.ts";
import { useNavigate } from "react-router-dom";
import FormButtonsGroup from "../controls/FormButtonsGroup.tsx";
import { FormattedMessage } from "react-intl";
import CancelButton from "../controls/CancelButton.tsx";

function SetlistEditScreen() {
  let setlistId: string | undefined = useParam("id");

  let newSetlist = false;
  let initialSetlist = undefined;
  if (!setlistId || setlistId === "_new_") {
    newSetlist = true;
    initialSetlist = defaultSetlist;
    setlistId = undefined;
  }

  const [setlist, setSetlist] = useState<
    SetlistWithSongs | NewSetlistWithSongs | undefined
  >(initialSetlist);
  const [originalSetlist, setOriginalSetlist] = useState(initialSetlist);
  const [selectSong, setSelectSong] = useState(false);
  const [addNewSong, setAddNewSong] = useState(false);

  const back = -1;
  const navigate = useNavigate();

  useEffect(() => {
    if (setlistId) {
      setSetlist(undefined);
      repository.getSetlist(setlistId).then((setlist) => {
        setSetlist(setlist);
        setOriginalSetlist(setlist);
      });
    }
  }, [setlistId]);

  if (!setlist || !originalSetlist) {
    return <LoadingIndicator />;
  }

  const addSong = (song: Song) => {
    //console.log("Song selected:", song);
    setSetlist({
      ...setlist,
      songs: [...(setlist.songs || []), song],
      songIds: [...(setlist.songIds || []), song.id],
    });
  };

  if (selectSong) {
    return (
      <SelectSongScreen
        onSelect={(song) => {
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
      <NewSongEditScreen
        onSave={(song) => {
          addSong(song);
          setAddNewSong(false);
        }}
        onCancel={() => {
          setAddNewSong(false);
        }}
      />
    );
  }

  const save = () =>
    repository.saveSetlist(setlist).then(() => {
      navigate(back);
    });

  const saveAsNew = () =>
    repository.saveSetlist(toNewSetlist(setlist)).then(() => {
      navigate(back);
    });

  return (
    <Screen name="setlist-editor" back={back}>
      <h1>
        <FormattedMessage id={newSetlist ? "setlist.new" : "setlist.edit"} />
      </h1>

      <SetlistEditView setlist={setlist} onChange={setSetlist} />

      <FormButtonsGroup>
        <Button variant="secondary" onClick={() => setSelectSong(true)}>
          <FormattedMessage id="setlist.add-song" />
        </Button>
        <Button variant="secondary" onClick={() => setAddNewSong(true)}>
          <FormattedMessage id="setlist.add-new-song" />
        </Button>
      </FormButtonsGroup>

      <FormButtonsGroup>
        <Button variant="primary" onClick={save} disabled={!setlist.title}>
          <FormattedMessage id="save" />
        </Button>

        {!newSetlist && (
          <Button
            variant="secondary"
            onClick={saveAsNew}
            disabled={!setlist.title || setlist.title === originalSetlist.title}
          >
            <FormattedMessage id="setlist.save-as-new" />
          </Button>
        )}

        <CancelButton back={back} />
      </FormButtonsGroup>
    </Screen>
  );
}

export default SetlistEditScreen;
