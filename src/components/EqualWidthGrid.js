function EqualWidthGrid({children}) {
    const gridTemplateColumns = Array(children.length).fill("1fr").join(" ");

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