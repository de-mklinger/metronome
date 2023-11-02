import Setlists from "./Setlists.js";
import {Setlist} from "../../types.ts";

export type SongSetlistsEditorProps = {
  setlists: Setlist[],
  onChange: (setlists: Setlist[]) => void
}

function SongSetlistsEditor({setlists, onChange}: SongSetlistsEditorProps) {
    return (
        <div className="form-group">
            <label>Setlists</label>
            <Setlists
                setlists={setlists}
                onSetlistsChange={onChange}
            />
        </div>
    );
}

export default SongSetlistsEditor;
