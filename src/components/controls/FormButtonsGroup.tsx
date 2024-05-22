import { PropsWithChildren } from "react";
import FormGroup from "./FormGroup.tsx";

export type FormButtonsGroupProps = PropsWithChildren;

export default function FormButtonsGroup({ children }: FormButtonsGroupProps) {
  return <FormGroup className="form-buttons-group">{children}</FormGroup>;
}
