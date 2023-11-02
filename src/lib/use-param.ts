import {useParams} from "react-router-dom";

export default function useParam(name: string) {
  const params = useParams() as Record<string, string>;
  const value = params[name];
  if (!value) {
    throw new Error("Missing parameter: " + name);
  }
  // TODO really needed?
  return decodeURIComponent(value);
}
