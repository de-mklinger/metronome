import useParam from "../../lib/use-param.ts";
import {useSetlist} from "../../lib/repository.ts";
import {useNavigate} from "react-router-dom";

export default function EditSetlist() {
  const id = useParam("id");

  const {setlist, update, save, wasSaved} = useSetlist(id);

  const navigate = useNavigate();

  if (wasSaved) {
    navigate(-1);
  }
}
