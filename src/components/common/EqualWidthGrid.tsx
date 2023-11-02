import {Children, PropsWithChildren} from "react";

function EqualWidthGrid({children}: PropsWithChildren) {
    const gridTemplateColumns = Array(Children.count(children)).fill("1fr").join(" ");

    return (
        <div style={{
            display: "inline-grid",
            gridTemplateColumns: gridTemplateColumns
        }}>
            {children}
        </div>
    );
}

export default EqualWidthGrid;
