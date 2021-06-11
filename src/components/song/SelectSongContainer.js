import {useEffect, useState} from "react";
import LoadingIndicator from "../LoadingIndicator";
import SelectSong from "./SelectSong";
import {Container} from "react-bootstrap";
import repository from "../../lib/repository";

function SelectSongContainer({onSelect}) {
    const [songs, setSongs] = useState(null);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        repository.getSongs().then(setSongs);
    }, []);

    if (songs === null) {
        return <LoadingIndicator/>;
    }

    let filteredSongs = songs;
    if (filter) {
        filteredSongs = songs.filter(song => song.title.toLowerCase().includes(filter.toLowerCase()));
    }

    return (
        <Container className="select-song-screen">
            <h1>Select Song</h1>

            <div className="form-group">
                <input
                    type="search"
                    className="form-control"
                    placeholder="Filter"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                />
            </div>

            <SelectSong
                songs={filteredSongs}
                onSelect={onSelect}
            />

            <div className="form-group">
                <button className="btn btn-link"
                        onClick={() => onSelect(null)}>
                    Cancel
                </button>
            </div>
        </Container>
    );
}

export default SelectSongContainer;