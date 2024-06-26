import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import QuarterNoteSvg from "../../images/quarter-note.svg?react";
import EqualWidthGrid from "../common/EqualWidthGrid.tsx";
import { Song } from "../../types.ts";
import classNames from "classnames";
import ListLg from "../common/ListLg.tsx";
import Button from "../controls/Button.tsx";

export type SetlistEditorSongsProps = {
  songs: Song[];
  onSongsChange: (songs: Song[]) => void;
};

function SetlistEditorSongs({ songs, onSongsChange }: SetlistEditorSongsProps) {
  const removeSongIdx = (idx: number) => {
    const newSongs = Array.from(songs);
    newSongs.splice(idx, 1);
    onSongsChange(newSongs);
  };

  const up = (idx: number) => {
    if (idx === 0) {
      return;
    }
    const newSongs = Array.from(songs);
    newSongs[idx - 1] = songs[idx];
    newSongs[idx] = songs[idx - 1];
    onSongsChange(newSongs);
  };

  const down = (idx: number) => {
    if (idx >= songs.length) {
      return;
    }
    const newSongs = Array.from(songs);
    newSongs[idx + 1] = songs[idx];
    newSongs[idx] = songs[idx + 1];
    onSongsChange(newSongs);
  };

  return (
    <ListLg>
      <ul>
        {songs.map((song, idx) => (
          <li key={idx}>
            <div className="title">
              <div>{song.title}</div>
              <div className="small">
                {song.timeSignatureBeats}/{song.timeSignatureNoteValue}{" "}
                <QuarterNoteSvg /> {song.bpm} BPM
              </div>
            </div>
            <EqualWidthGrid>
              <Button
                variant="secondary"
                className={classNames({
                  invisible: idx === 0 || songs.length <= 1,
                })}
                onClick={() => up(idx)}
              >
                <FontAwesomeIcon icon={faAngleUp} />
              </Button>
              <Button
                variant="secondary"
                className={classNames({
                  invisible: idx === songs.length - 1 || songs.length <= 1,
                })}
                onClick={() => down(idx)}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </Button>
              <Button variant="secondary" onClick={() => removeSongIdx(idx)}>
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </EqualWidthGrid>
          </li>
        ))}
      </ul>
    </ListLg>
  );
}

export default SetlistEditorSongs;
