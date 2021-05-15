import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

function Setlists({setlists, onSetlistsChange}) {
    const removeSetlist = setlistId => {
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