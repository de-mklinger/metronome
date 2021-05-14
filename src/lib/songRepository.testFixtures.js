const defaultSong = {
    timeSignatureBeats: 4,
    timeSignatureNoteValue: 4,
    subDivisions: 1,
    songLength: null,
    accents: [2, 1, 1, 1],
    // created, updated, owner, tenant, ...
}

const spielchen = Object.assign({}, defaultSong, {
    id: 'spiel /chen',
    title: 'Spielchen',
    bpm: 240,
});

const wuff = Object.assign({}, defaultSong, {
    id: 'wuff',
    title: 'Wuff',
    bpm: 280,
});

const atem = Object.assign({}, defaultSong, {
    id: 'atem',
    title: 'Atem des Hauses',
    bpm: 240,
});

const gott = Object.assign({}, defaultSong, {
    id: 'gott',
    title: 'Gott spielen',
    bpm: 180,
});

const gefaerbt = Object.assign({}, defaultSong, {
    id: 'gefaerbt',
    title: 'Gefärbt',
    bpm: 160,
});

const irgendjemand = Object.assign({}, defaultSong, {
    id: 'irgendjemand',
    title: 'Irgendjemand',
    bpm: 170
});

const geldweg = Object.assign({}, defaultSong, {
    id: 'geldweg',
    title: 'Geld weg',
    bpm: 184,
});

const ufos = Object.assign({}, defaultSong, {
    id: 'ufos',
    title: 'UFOs',
    bpm: 268,
});

const weitergehen = Object.assign({}, defaultSong, {
    id: 'weitergehen',
    title: 'Weitergehen',
    bpm: 140,
});

const projektor = Object.assign({}, defaultSong, {
    id: 'projektor',
    title: 'Projektor',
    bpm: 186,
});

const trotzdem = Object.assign({}, defaultSong, {
    id: 'trotzdem',
    title: 'Trotzdem (langsamer, sehr, sehr langer Titel blabla)',
    bpm: 130,
});


const allSongs = [
    spielchen,
    wuff,
    atem,
    gott,
    gefaerbt,
    irgendjemand,
    geldweg,
    ufos,
    weitergehen,
    projektor,
    trotzdem
];

const jsssSetlist = {
    id: 'setlist1',
    title: 'Jimi Satans Schuhshop',
    archived: false,
    songIds: [
        spielchen.id,
        wuff.id,
        atem.id,
        gott.id,
        gefaerbt.id,
        irgendjemand.id,
        geldweg.id,
        ufos.id,
        weitergehen.id,
        projektor.id,
        trotzdem.id
    ]
    // created, updated, owner, tenant, ...
}

const allSetlists = [
    jsssSetlist
]

// const testFixtures = {
//     wuff: wuff,
//     allSongs: allSongs,
//     jsssSetlist: jsssSetlist,
//     allSetlists: allSetlists
// };

export {wuff, allSongs, jsssSetlist, allSetlists};
