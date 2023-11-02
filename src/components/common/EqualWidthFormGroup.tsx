import {FormGroup} from "react-bootstrap";
import EqualWidthGrid from "./EqualWidthGrid.tsx";
import {PropsWithChildren} from "react";

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
