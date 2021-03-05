import Beat from "./Beat";

function BeatBar(props) {
    let beats = [];

    for (let idx = 0; idx < props.timeSignatureBeats; idx++) {
        beats.push(
            <Beat
                key={idx}
                accent={props.accentBeatIndices.indexOf(idx) !== -1}
                active={idx === props.activeBeatIdx}/>
        );
    }

    return (
        <div id="beat-bar">
            {beats}
        </div>
    );
}

export default BeatBar;