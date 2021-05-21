import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import songRepository from "../../lib/songRepository";
import SongEditor from "./SongEditor";
import LoadingIndicator from "../LoadingIndicator";

function SongEditorContainer({onSongChange}) {
    let {id} = useParams();
    id = decodeURIComponent(id); // TODO no way to automatically decode??

    const [song, setSong] = useState(null);

    useEffect(() => {
        setSong(null);
        songRepository.getSong(id).then(setSong);
    }, [id])

    if (song === null) {
        return <LoadingIndicator />
    }

    return <SongEditor
        song={song}
        onSongChange={onSongChange}
    />
}

export default SongEditorContainer;