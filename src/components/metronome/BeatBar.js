import Beat from "./Beat";

function BeatBar({timeSignatureBeats, accents, activeBeatIdx}) {
    let beats = [];

    for (let idx = 0; idx < timeSignatureBeats; idx++) {
        let isAccent = accents.length > idx && accents[idx] > 1; // TODO

        beats.push(
            <Beat
                key={idx}
                accent={isAccent}
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