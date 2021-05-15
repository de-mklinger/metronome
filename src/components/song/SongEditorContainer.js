import {useParams} from "react-router-dom";
import {useState} from "react";
import songRepository from "../../lib/songRepository";
import SongEditor from "./SongEditor";
import LoadingIndicator from "../LoadingIndicator";

function SongEditorContainer() {
    let {id} = useParams();
    id = decodeURIComponent(id); // TODO no way to automatically decode??

    const [song, setSong] = useState(null);

    if (song === null) {
        songRepository.getSong(id).then(setSong);
        return <LoadingIndicator />
    } else {
        return <SongEditor song={song} />
    }
}

export default SongEditorContainer;