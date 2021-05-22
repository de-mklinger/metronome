import './songRepository';
import songRepository from "./songRepository";
import {allSongs} from "./songRepository.testFixtures";

test('provides song list', () => {
    return songRepository.getSongs().then(songs => {
        expect(songs).toBeTruthy();
        expect(songs[0].title).toBe(allSongs[0].title);
    });
});

test('has existing song', () => {
    return songRepository.getSong('wuff').then(song => {
        expect(song).toBeTruthy();
        expect(song.title).toBe('Wuff');
    });
});

test('throws error for non-existing song', () => {
    return expect(songRepository.getSong('doesnotexist'))
        .rejects.toBeTruthy();
});

test('provides setlist list', () => {
    return songRepository.getSetlists().then(setlists => {
        expect(setlists).toBeTruthy();
        expect(setlists[0].title).toBe('Jimi Satans Schuhshop');
    });
});

test('has setlist', () => {
    return songRepository.getSetlist('setlist1').then(setlist => {
        expect(setlist).toBeTruthy();
        expect(setlist.title).toBe('Jimi Satans Schuhshop');
    });
});

test('throws error for non-existing setlist', () => {
    return expect(songRepository.getSetlist('doesnotexist'))
        .rejects.toBeTruthy();
});
