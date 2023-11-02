import {useEffect, useState} from "react";
import LoadingIndicator from "../LoadingIndicator.tsx";
import SelectSong from "./SelectSong.tsx";
import {Container} from "react-bootstrap";
import repository from "../../lib/repository.ts";
import {Song} from "../../types.ts";

export type SelectSongContainerProps = {
  onSelect: (song: Song) => void
  onCancel: () => void
}

function SelectSongContainer({onSelect, onCancel}: SelectSongContainerProps) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [filter, setFilter] = useState("");

    // TODO loading state
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
                        onClick={() => onCancel()}>
                    Cancel
                </button>
            </div>
        </Container>
    );
}

export default SelectSongContainer;
