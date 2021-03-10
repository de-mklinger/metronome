const wuff = {
    id: 'song1',
    title: 'Wuff',
    bpm: 280,
    timeSignatureBeats: 4,
    timeSignatureNoteValue: 4,
    subDivisions: 1,
    songLength: null,
    accents: [2, 1, 1, 1],
    // created, updated, owner, tenant, ...
};

const allSongs = [
    wuff
];

const jsssSetlist = {
    id: 'setlist1',
    title: 'Jimi Satans Schuhshop',
    archived: false,
    songs: [
        wuff
    ]
    // created, updated, owner, tenant, ...
}

const allSetlists = [
    jsssSetlist
]

const testFixtures = {
    wuff: wuff,
    allSongs: allSongs,
    jsssSetlist: jsssSetlist,
    allSetlists: allSetlists
};

export default testFixtures;
