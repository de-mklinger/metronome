const defaultSong = {
    timeSignatureBeats: 4,
    timeSignatureNoteValue: 4,
    subDivisions: 1,
    songLength: null,
    accents: [2, 1, 1, 1],
    // created, updated, owner, tenant, ...
}

const spielchen = Object.assign({}, defaultSong, {
    id: 'spielchen',
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

const allSongs = [
    spielchen,
    wuff,
    atem,
    gott
];

const jsssSetlist = {
    id: 'setlist1',
    title: 'Jimi Satans Schuhshop',
    archived: false,
    songs: [
        spielchen,
        wuff,
        atem,
        gott
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
