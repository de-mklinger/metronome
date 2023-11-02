import {Redirect} from "react-router-dom";
import SetlistEditScreen from "./SetlistEditScreen.tsx";
import {useState} from "react";
import {SetlistWithSongs} from "../../types.ts";
import useParam from "../../lib/use-param.ts";

export type SetlistEditorRouteProps = {
    onSetlistChange: (setlist: SetlistWithSongs) => void
}

function SetlistEditRoute({onSetlistChange}: SetlistEditorRouteProps) {
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
        <SetlistEditScreen
            setlistId={id}
            onSetlistChange={handleSetlistChange}
            onCancel={() => setSubmitted(true)}
        />
    );
}

export default SetlistEditRoute;
