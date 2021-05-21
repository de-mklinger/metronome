import BeatBar from './BeatBar';
import SongControls from "./SongControls";
import PlayControls from "./PlayControls";
import MetronomeAudio from "./MetronomeAudio";
import {useState} from "react";
import TimeSignatureModal from "../TimeSignatureModal";
import {defaultSong} from "../../lib/env";

function getActiveSong(setlist, activeSetlistIdx) {
    if (setlist && setlist.songs) {
        return setlist.songs[activeSetlistIdx];
    } else {
        return defaultSong;
    }
}

function Metronome({setlist, onSetlistSelect}) {
    const [started, setStarted] = useState(false);
    const [activeBeatIdx, setActiveBeatIdx] = useState(-1);

    const [activeSetlistIdx, setActiveSetlistIdx] = useState(0);

    let activeSong = getActiveSong(setlist, activeSetlistIdx);

    const [bpm, setBpm] = useState(activeSong.bpm);
    const [timeSignatureBeats, setTimeSignatureBeats] = useState(activeSong.timeSignatureBeats);
    const [timeSignatureNoteValue, setTimeSignatureNoteValue] = useState(activeSong.timeSignatureNoteValue);
    const [accents, setAccents] = useState(activeSong.accents);

    const [editTimeSignature, setEditTimeSignature] = useState(false);

    const onSetlistAndSongSelect = (setlist, selectedSetlistIdx = 0) => {
        console.log("onSetlistAndSongSelect", setlist, selectedSetlistIdx);
        onSetlistSelect(setlist);
        if (selectedSetlistIdx < setlist.songs.length) {
            setActiveSetlistIdx(selectedSetlistIdx);
        } else {
            setActiveSetlistIdx(0);
        }
        let activeSong = getActiveSong(setlist, selectedSetlistIdx);
        setBpm(activeSong.bpm);
        setTimeSignatureBeats(activeSong.timeSignatureBeats);
        setTimeSignatureNoteValue(activeSong.timeSignatureNoteValue);
        setAccents(activeSong.accents);
    }

    return (
        <div className="metronome">
            <MetronomeAudio
                started={started}
                bpm={bpm}
                timeSignatureBeats={timeSignatureBeats}
                accents={accents}
                onActiveBeatIdxChange={setActiveBeatIdx}
            />

            <BeatBar
                timeSignatureBeats={timeSignatureBeats}
                accents={accents}
                activeBeatIdx={activeBeatIdx}
            />

            <SongControls
                setlist={setlist}
                activeSetlistIdx={activeSetlistIdx}
                timeSignatureBeats={timeSignatureBeats}
                timeSignatureNoteValue={timeSignatureNoteValue}
                onSongSelect={idx => onSetlistAndSongSelect(setlist, idx)}
                onSetlistDeselect={() => onSetlistAndSongSelect(null)}
                onTimeSignatureClick={() => setEditTimeSignature(true)}
            />

            <PlayControls
                started={started}
                setlist={setlist}
                activeSetlistIdx={activeSetlistIdx}
                bpm={bpm}
                onBpmChange={setBpm}
                onPlay={() => setStarted(!started)}
                onSongSelect={idx => onSetlistAndSongSelect(setlist, idx)}
            />

            <TimeSignatureModal
                show={editTimeSignature}
                onHide={() => setEditTimeSignature(false)}
                timeSignatureBeats={timeSignatureBeats}
                onTimeSignatureBeatsChange={setTimeSignatureBeats}
                timeSignatureNoteValue={timeSignatureNoteValue}
                onTimeSignatureNoteValueChange={setTimeSignatureNoteValue}
            />

        </div>
    );
}

export default Metronome;
