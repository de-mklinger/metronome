import SetlistEditorSongs from "./SetlistEditorSongs.js";
import {NewSetlistWithSongs, Song} from "../../types.ts";

export type SetlistEditViewProps<T extends NewSetlistWithSongs> = {
    setlist: T,
    onChange: (setlist: T) => void
}

function SetlistEditView<T extends NewSetlistWithSongs>({setlist, onChange}: SetlistEditViewProps<T>) {
    function fireChange<K extends keyof T>(attributeName: K, attributeValue: T[K]) {
        const changedSetlist = { ...setlist };
        changedSetlist[attributeName] = attributeValue;
        onChange(changedSetlist);
    }

    const fireSongsChange = (songs: Song[]) => {
        const changedSetlist = { ...setlist };
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

export default SetlistEditView;
