import EqualWidthGrid from "./EqualWidthGrid.tsx";
import {PropsWithChildren} from "react";
import FormGroup from "../controls/FormGroup.tsx";

function EqualWidthFormGroup({children}: PropsWithChildren) {
    return (
        <FormGroup>
            <EqualWidthGrid>
                {children}
            </EqualWidthGrid>
        </FormGroup>
    );
}

export default EqualWidthFormGroup;
