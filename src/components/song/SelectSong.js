function SelectSong({songs, onSelect}) {
    return (
        <div className="songs">
            <ul>
                {songs.map(song =>
                    <li key={song.id}>
                        <div className="title">
                            {song.title}
                        </div>
                        <div className="actions">
                            <button className="btn btn-primary" onClick={() => onSelect(song)}>
                                Select
                            </button>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default SelectSong;