import Setlists from "./Setlists.js";
import { Setlist } from "../../types.ts";
import { FormattedMessage } from "react-intl";

export type SongSetlistsEditorProps = {
  setlists: Setlist[];
  onChange: (setlists: Setlist[]) => void;
};

function SongSetlistsEditor({ setlists, onChange }: SongSetlistsEditorProps) {
  return (
    <div className="form-group">
      <label>
        <FormattedMessage id="song.setlists" />
      </label>
      <Setlists setlists={setlists} onSetlistsChange={onChange} />
    </div>
  );
}

export default SongSetlistsEditor;
