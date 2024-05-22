import {useEffect, useState} from "react";
import LoadingIndicator from "../common/LoadingIndicator.tsx";
import SelectSong from "./SelectSong.tsx";
import repository from "../../lib/repository.ts";
import {Song} from "../../types.ts";
import Button from "../controls/Button.tsx";
import Container from "../controls/Container.tsx";

export type SelectSongScreenProps = {
  onSelect: (song: Song) => void
  onCancel: () => void
}

function SelectSongScreen({onSelect, onCancel}: SelectSongScreenProps) {
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
                <Button variant="link"
                        onClick={() => onCancel()}>
                    Cancel
                </Button>
            </div>
        </Container>
    );
}

export default SelectSongScreen;
