import SetlistEditorSongs from "./SetlistEditorSongs.js";
import {NewSetlistWithSongs, Song} from "../../types.ts";

export type SetlistEditorProps<T extends NewSetlistWithSongs> = {
    setlist: T,
    onChange: (setlist: T) => void
}

function SetlistEditor<T extends NewSetlistWithSongs>({setlist, onChange}: SetlistEditorProps<T>) {
    function fireChange<K extends keyof T>(attributeName: K, attributeValue: T[K]) {
        let changedSetlist = { ...setlist };
        changedSetlist[attributeName] = attributeValue;
        onChange(changedSetlist);
    }

    const fireSongsChange = (songs: Song[]) => {
        let changedSetlist = { ...setlist };
        changedSetlist.songs = songs;
        changedSetlist.songIds = songs.map(song => song.id);
        onChange(changedSetlist);
    }

    return (
            <>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" placeholder="Enter setlist title"
                           value={setlist.title}
                           onChange={e => fireChange("title", e.target.value)}
                    />
                </div>

                {
                    setlist.songs && setlist.songs.length > 0 &&
                    <div className="form-group">
                        <label>Songs</label>
                        <SetlistEditorSongs
                            songs={setlist.songs}
                            onSongsChange={fireSongsChange}
                        />
                    </div>
                }
            </>
    );
}

export default SetlistEditor;
