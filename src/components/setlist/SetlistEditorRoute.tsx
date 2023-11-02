import {Redirect} from "react-router-dom";
import SetlistEditorContainer from "./SetlistEditorContainer.js";
import {useState} from "react";
import {SetlistWithSongs} from "../../types.ts";
import useParam from "../../lib/use-param.ts";

export type SetlistEditorRouteProps = {
    onSetlistChange: (setlist: SetlistWithSongs) => void
}

function SetlistEditorRoute({onSetlistChange}: SetlistEditorRouteProps) {
    const id = useParam("id");

    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return <Redirect to="/"/>
    }

    const handleSetlistChange = (setlist: SetlistWithSongs) => {
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
