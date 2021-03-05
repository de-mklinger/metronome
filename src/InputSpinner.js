
function InputSpinner(props) {
    return (
        <>
            <input
                type="number"
                min={props.min}
                max={props.max}
                value={props.value}
                className="form-control"
                style={{width: "6rem", display: "inline-block"}}
                onChange={props.onChange}
                onWheel={e => e.target.focus()}
            />
        </>
    );
}

export default InputSpinner;