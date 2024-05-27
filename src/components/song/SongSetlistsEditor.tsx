import Setlists from "./Setlists.js";
import {Setlist} from "../../types.ts";
import {FormattedMessage} from "react-intl";

export type SongSetlistsEditorProps = {
  setlists: Setlist[];
  onChange: (setlists: Setlist[]) => void;
};

function SongSetlistsEditor({setlists, onChange}: SongSetlistsEditorProps) {
  return (
    <div className="form-group">
      <label>
        <FormattedMessage id="song.setlists"/>
      </label>
      {setlists.length > 0
        ?
        <Setlists setlists={setlists} onSetlistsChange={onChange}/>
        :
        <div>
          <FormattedMessage id="song.no-setlists"/>
        </div>
      }
    </div>
  );
}

export default SongSetlistsEditor;
