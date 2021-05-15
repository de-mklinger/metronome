import Beat from "./Beat";

function BeatBar({timeSignatureBeats, accentBeatIndices, activeBeatIdx}) {
    let beats = [];

    for (let idx = 0; idx < timeSignatureBeats; idx++) {
        beats.push(
            <Beat
                key={idx}
                accent={accentBeatIndices.indexOf(idx) !== -1}
                active={idx === activeBeatIdx}/>
        );
    }

    return (
        <div id="beat-bar">
            {beats}
        </div>
    );
}

export default BeatBar;