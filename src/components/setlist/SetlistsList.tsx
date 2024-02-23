import { SetlistWithSongs } from "../../types.ts";
import ListLg from "../common/ListLg.tsx";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import classNames from "classnames";

export type SetlistsListProps = {
  setlists: SetlistWithSongs[];
  activeSetlistId?: string;
  onSelect: (setlists: SetlistWithSongs) => void;
};

export default function SetlistsList({
  setlists,
  activeSetlistId,
  onSelect,
}: SetlistsListProps) {
  console.log("active:", activeSetlistId)

  return (
    <ListLg>
      <ul>
        {setlists.map((setlist) => (
          <li
            key={setlist.id}
            className={classNames({ active: setlist.id === activeSetlistId })}
          >
            <div className="title">
              <div className="title">{setlist.title}</div>
              <div className="title small">{setlist.songs.length} songs</div>
            </div>
            <div className="actions">
              <Link
                className="btn btn-secondary"
                to={"/setlists/" + encodeURIComponent(setlist.id)}
              >
                Edit
              </Link>
              <Button
                variant="secondary"
                onClick={() => {
                  onSelect(setlist);
                }}
              >
                Select
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </ListLg>
  );
}
