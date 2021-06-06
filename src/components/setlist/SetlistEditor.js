import Songs from "./Songs";

function SetlistEditor({setlist, onChange}) {
    const fireChange = (attributeName, attributeValue) => {
        let changedSetlist = { ...setlist };
        changedSetlist[attributeName] = attributeValue;
        onChange(changedSetlist);
    }

    const fireSongsChange = songs => {
        let changedSetlist = { ...setlist };
        changedSetlist.songs = songs;
        changedSetlist.songIds = songs.map(song => song.id);
        onChange(changedSetlist);
    }

    return (
            <>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" placeholder="Enter song title"
                           value={setlist.title}
                           onChange={e => fireChange("title", e.target.value)}
                    />
                </div>

                {
                    setlist.songs && setlist.songs.length > 0 &&
                    <div className="form-group">
                        <label>Songs</label>
                        <Songs
                            songs={setlist.songs}
                            onSongsChange={fireSongsChange}
                        />
                    </div>
                }
            </>
    );
}

export default SetlistEditor;