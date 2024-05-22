import LoadingIndicator from "../common/LoadingIndicator.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useGetSetlists } from "../../lib/repository.js";
import Button from "../controls/Button.tsx";
import Screen from "../controls/Screen.tsx";
import { useAppState } from "../../lib/use-app-state.ts";
import { FormattedMessage } from "react-intl";
import FormButtonsGroup from "../controls/FormButtonsGroup.tsx";
import FormGroup from "../controls/FormGroup.tsx";

function SetlistsScreen() {
  const appState = useAppState();
  const {
    invoke: getSetlists,
    inProgress: getSetlistsInProgress,
    error,
    result: setlists,
  } = useGetSetlists();

  const back = "/";
  const navigate = useNavigate();

  if (!getSetlistsInProgress && !setlists) {
    getSetlists();
    return <LoadingIndicator />;
  }

  if (getSetlistsInProgress || !setlists) {
    return <LoadingIndicator />;
  }

  if (error) {
    throw error;
  }

  return (
    <Screen name="setlists-editor">
      <h1>
        <FormattedMessage id="setlists" />
      </h1>

      {setlists && setlists.length > 0 && (
        <FormGroup className="setlists">
          <ul>
            {setlists.map((setlist) => (
              <li
                key={setlist.id}
                className={
                  appState.setlist && appState.setlist.id === setlist.id
                    ? "active"
                    : ""
                }
              >
                <div className="title">
                  <div className="title">{setlist.title}</div>
                  <div className="title small">
                    <FormattedMessage
                      id="setlist.number-of-songs"
                      values={{ count: setlist.songs.length }}
                    />
                  </div>
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
                      appState.setlist = setlist;
                      navigate(back);
                    }}
                  >
                    Select
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </FormGroup>
      )}

      <FormButtonsGroup>
        <Link className="btn btn-secondary" to="/setlists/_new_">
          <FormattedMessage id="setlist.new" />
        </Link>
        <Link to={back} className="btn btn-link">
          <FormattedMessage id="cancel" />
        </Link>
      </FormButtonsGroup>
    </Screen>
  );
}

export default SetlistsScreen;
