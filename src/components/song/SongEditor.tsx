import BpmKnob from "../common/BpmKnob.tsx";
import Accents from "./Accents.js";
import TimeSignature from "./TimeSignature.js";
import { NewSong } from "../../types.ts";
import Row from "../controls/Row.tsx";
import Col from "../controls/Col.tsx";
import { FormattedMessage } from "react-intl";

export type SongEditorProps<T extends NewSong> = {
  song: T;
  onChange: (song: T) => void;
};

export default function SongEditor<T extends NewSong>({
  song,
  onChange,
}: SongEditorProps<T>) {
  function fireChange<K extends keyof T>(
    attributeName: K,
    attributeValue: T[K],
  ) {
    const changedSong = { ...song };
    changedSong[attributeName] = attributeValue;
    onChange(changedSong);
  }

  return (
    <>
      <div className="form-group">
        <label htmlFor="title">
          <FormattedMessage id="song.title" />
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          placeholder="Enter song title"
          value={song.title}
          autoFocus={true}
          onChange={(e) => fireChange("title", e.target.value)}
        />
      </div>
      <div className="form-group">
        <Row>
          <Col>
            <label htmlFor="bpm">
              <FormattedMessage id="song.bpm" />
            </label>
            <input
              type="number"
              className="form-control"
              id="bpm"
              placeholder="Enter BPM"
              min={1}
              value={song.bpm}
              onChange={(e) => fireChange("bpm", parseInt(e.target.value, 10))}
            />
          </Col>
          <Col className="speed-knob-col">
            <BpmKnob
              bpm={song.bpm}
              onBpmChange={(bpm) => fireChange("bpm", bpm)}
            />
          </Col>
        </Row>
      </div>
      <div className="form-group">
        <label htmlFor="timeSignatureBeats">
          <FormattedMessage id="song.time-signature" />
        </label>
        <TimeSignature
          beats={song.timeSignatureBeats}
          noteValue={song.timeSignatureNoteValue}
          onBeatsChange={(beats) => fireChange("timeSignatureBeats", beats)}
          onNoteValueChange={(noteValue) =>
            fireChange("timeSignatureNoteValue", noteValue)
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="subDivisions">
          <FormattedMessage id="song.sub-divisions" />
        </label>
        <input
          type="number"
          className="form-control"
          id="subDivisions"
          placeholder="Enter subDivisions"
          value={song.subDivisions}
          onChange={(e) =>
            fireChange("subDivisions", parseInt(e.target.value, 10))
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="accent0">
          <FormattedMessage id="song.accents" />
        </label>
        <Accents
          timeSignatureBeats={song.timeSignatureBeats}
          accents={song.accents}
          onAccentsChange={(accents) => fireChange("accents", accents)}
        />
      </div>
    </>
  );
}
