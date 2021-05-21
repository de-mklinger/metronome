import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import songRepository from "../../lib/songRepository";
import LoadingIndicator from "../LoadingIndicator";
import SetlistEditor from "./SetlistEditor";

function SetlistEditorContainer({onSetlistChange}) {
    let {id} = useParams();
    id = decodeURIComponent(id); // TODO no way to automatically decode??

    const [setlist, setSetlist] = useState(null);

    useEffect(() => {
        setSetlist(null);
        songRepository.getSetlist(id).then(setSetlist);
    }, [id])

    if (setlist === null) {
        return <LoadingIndicator />
    }

    return <SetlistEditor
        setlist={setlist}
        onSetlistChange={onSetlistChange}
    />
}

export default SetlistEditorContainer;