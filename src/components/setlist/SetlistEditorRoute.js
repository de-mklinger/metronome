import {Redirect, useParams} from "react-router-dom";
import SetlistEditorContainer from "./SetlistEditorContainer";
import {useState} from "react";

function SetlistEditorRoute({onSetlistChange}) {
    let {id} = useParams();
    id = decodeURIComponent(id);

    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return <Redirect to="/"/>
    }

    const handleSetlistChange = setlist => {
        onSetlistChange(setlist);
        setSubmitted(true);
    }

    return (
        <SetlistEditorContainer
            setlistId={id}
            onSetlistChange={handleSetlistChange}
            onCancel={() => setSubmitted(true)}
        />
    );
}

export default SetlistEditorRoute;