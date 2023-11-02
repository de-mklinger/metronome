import {defaultAppState, defaultSong} from "./env.ts";
import {Setlist, Song} from "../types.ts";

const appState = { ...defaultAppState };

const spielchen: Song = {
    ...defaultSong,
    id: 'spiel /chen',
    title: 'Spielchen',
    bpm: 240,
};

const wuff: Song = {
    ...defaultSong,
    id: 'wuff',
    title: 'Wuff',
    bpm: 280,
};

const atem: Song = {
    ...defaultSong,
    id: 'atem',
    title: 'Atem des Hauses',
    bpm: 240,
};

const gott: Song = {
    ...defaultSong,
    id: 'gott',
    title: 'Gott spielen',
    bpm: 180,
};

const gefaerbt: Song = {
    ...defaultSong,
    id: 'gefaerbt',
    title: 'Gefärbt',
    bpm: 160,
};

const irgendjemand: Song = {
    ...defaultSong,
    id: 'irgendjemand',
    title: 'Irgendjemand',
    bpm: 170
};

const geldweg: Song = {
    ...defaultSong,
    id: 'geldweg',
    title: 'Geld weg',
    bpm: 184,
};

const ufos: Song = {
    ...defaultSong,
    id: 'ufos',
    title: 'UFOs',
    bpm: 268,
};

const weitergehen: Song = {
    ...defaultSong,
    id: 'weitergehen',
    title: 'Weitergehen',
    bpm: 140,
};

const projektor: Song = {
    ...defaultSong,
    id: 'projektor',
    title: 'Projektor',
    bpm: 186,
};

const trotzdem: Song = {
    ...defaultSong,
    id: 'trotzdem',
    title: 'Trotzdem (langsamer, sehr, sehr langer Titel blabla)',
    bpm: 130,
};


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

const jsssSetlist: Setlist = {
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

const blablaSetlist: Setlist = {
    id: 'setlist2',
    title: 'Bla bla bla',
    archived: false,
    songIds: [
        spielchen.id,
        wuff.id
    ]
};

const allSetlists = [
    jsssSetlist,
    blablaSetlist
]

// const testFixtures = {
//     wuff: wuff,
//     allSongs: allSongs,
//     jsssSetlist: jsssSetlist,
//     allSetlists: allSetlists
// };

export {appState, wuff, allSongs, jsssSetlist, allSetlists};
