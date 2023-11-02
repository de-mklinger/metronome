// data from https://en.wikipedia.org/wiki/Tempo

type Tempo = [
  string,
  string,
  number,
  number
]

let tempos: Tempo[] = [
    ["Larghissimo", "very, very slowly", 1, 24],
    ["Grave", "very slow", 25, 45],
    ["Largo", "broadly", 40, 60],
    ["Lento", "slowly", 45, 60],
    ["Larghetto", "rather broadly", 60, 66],
    ["Adagio", "slowly with great expression[10]", 66, 76],
    ["Adagietto", "slower than andante", 72, 76],
    ["Andante", "at a walking pace", 76, 108],
    ["Andantino", "slightly faster than andante - although, in some cases, it can be taken to mean slightly slower than andante", 80, 108],
    ["Marcia moderato", "moderately, in the manner of a march", 83, 85],
    ["Andante moderato", "between andante and moderato (thus the name)", 92, 112],
    ["Moderato", "at a moderate speed", 108, 120],
    ["Allegretto", "by the mid-19th century, moderately fast", 112, 120],
    ["Allegro moderato", "close to, but not quite allegro", 116, 120],
    ["Allegro", "fast, quick, and bright", 120, 156],
    ["Vivace", "lively and fast", 156, 176],
    ["Vivacissimo", "very fast and lively", 172, 176],
    ["Allegrissimo", "very fast", 172, 176],
    ["Allegro vivace", "very fast", 172, 176],
    ["Presto", "very, very fast", 168, 200],
    ["Prestissimo", "even faster than presto", 200, 201]
];

let minBpm = Number.POSITIVE_INFINITY;
let maxBpm = Number.NEGATIVE_INFINITY;
let labelsByBpm: Record<number, string[]> = {};

tempos.forEach(tempo => {
    let label = tempo[0];
    let fromBpm = tempo[2];
    let toBpm = tempo[3];
    for (let bpm = fromBpm; bpm <= toBpm; bpm++) {
        minBpm = Math.min(minBpm, bpm);
        maxBpm = Math.max(maxBpm, bpm);
        if (!labelsByBpm[bpm]) {
            labelsByBpm[bpm] = [];
        }
        labelsByBpm[bpm].push(label);
    }
});

function getLabels(bpm: number) {
    if (!bpm || bpm < minBpm) {
        return labelsByBpm[minBpm];
    }
    if (bpm > maxBpm) {
        return labelsByBpm[maxBpm];
    }
    return labelsByBpm[bpm];
}

export { getLabels }
