import Setlists from "./Setlists";

function SongSetlistsEditor({setlists, onChange}) {
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