import {FormGroup} from "react-bootstrap";
import EqualWidthGrid from "./EqualWidthGrid";

function EqualWidthFormGroup({children}) {
    return (
        <FormGroup>
            <EqualWidthGrid>
                {children}
            </EqualWidthGrid>
        </FormGroup>
    );
}

export default EqualWidthFormGroup;