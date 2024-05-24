import QuarterNoteSvg from "../../images/quarter-note.svg?react";
import { Song } from "../../types.ts";
import Button from "../controls/Button.tsx";
import ListLg from "../common/ListLg.tsx";
import {FormattedMessage} from "react-intl";

export type SongsListProps = {
  songs: Song[];
  onEdit?: (song: Song) => void;
  onSelect?: (song: Song) => void;
};

function SongsList({songs, onEdit, onSelect}: SongsListProps) {
  return (
    <ListLg>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <div className="title">
              <div>{song.title}</div>
              <div className="small">
                {song.timeSignatureBeats}/{song.timeSignatureNoteValue}{" "}
                <QuarterNoteSvg /> {song.bpm} BPM
              </div>
            </div>
            <div className="actions">
              {onEdit &&
                <Button variant="secondary" onClick={() => onEdit(song)}>
                  <FormattedMessage id="edit" />
                </Button>
              }
              {onSelect &&
                <Button variant="secondary" onClick={() => onSelect(song)}>
                  <FormattedMessage id="select" />
                </Button>
              }
            </div>
          </li>
        ))}
      </ul>
    </ListLg>
  )
}

export default SongsList;
