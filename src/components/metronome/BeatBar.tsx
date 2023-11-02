import Beat from "./Beat.tsx";
import {NewSong, Song} from "../../types.ts";

export type BeatBarProps = {
    song: Song | NewSong,
    activeBeatIdx: number
}

function BeatBar({song, activeBeatIdx}: BeatBarProps) {
    let beats = [];

    for (let idx = 0; idx < song.timeSignatureBeats; idx++) {
        let isAccent = song.accents.length > idx && song.accents[idx] > 1; // TODO

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
