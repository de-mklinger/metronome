import SongEditor from "../song/SongEditor.js";
import { defaultSong } from "../../lib/env.js";
import repository from "../../lib/repository.js";
import { useState } from "react";
import { Song } from "../../types.ts";
import Button from "../controls/Button.tsx";
import { FormattedMessage } from "react-intl";
import Screen from "../controls/Screen.tsx";
import FormButtonsGroup from "../controls/FormButtonsGroup.tsx";

export type NewSongEditorContainerProps = {
  onSave: (song: Song) => void;
  onCancel: () => void;
};

function NewSongEditScreen({ onSave, onCancel }: NewSongEditorContainerProps) {
  const [song, setSong] = useState(defaultSong);

  const save = () =>
    repository.saveSong(song).then((savedSong) => {
      onSave(savedSong);
    });

  return (
    <Screen name="song-editor">
      <h1>
        <FormattedMessage id="song.new-song" />
      </h1>

      <SongEditor song={song} onChange={setSong} />

      <FormButtonsGroup>
        <Button onClick={() => save()}>
          <FormattedMessage id="save" />
        </Button>
        <Button variant="link" onClick={() => onCancel()}>
          <FormattedMessage id="cancel" />
        </Button>
      </FormButtonsGroup>
    </Screen>
  );
}

export default NewSongEditScreen;
