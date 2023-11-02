import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {Setlist} from "../../types.ts";

export type SetlistsProps = {
  setlists: Setlist[]
  onSetlistsChange: (setlists: Setlist[]) => void
}

function Setlists({setlists, onSetlistsChange}: SetlistsProps) {
    const removeSetlist = (setlistId: string) => {
        const newSetlists = setlists.filter(setlist => setlist.id !== setlistId);
        onSetlistsChange(newSetlists);
    }

    return (
        <div className="setlists">
            <ul>
                {setlists.map(setlist =>
                    <li key={setlist.id}>
                        <span>
                            {setlist.title}
                        </span>
                        <span className="px-2" onClick={() => removeSetlist(setlist.id)}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default Setlists;
