import './songRepository';
import {allSongs} from "./inMemoryRepository.testFixtures";
import newRepository from "./baseRepository";
import inMemoryRepositoryImpl from "./inMemoryRepositoryImpl";

const inMemorySongRepository = newRepository(inMemoryRepositoryImpl);

test('provides song list', () => {
    return inMemorySongRepository.getSongs().then(songs => {
        expect(songs).toBeTruthy();
        expect(songs[0].title).toBe(allSongs[0].title);
    });
});

test('has existing song', () => {
    return inMemorySongRepository.getSong('wuff').then(song => {
        expect(song).toBeTruthy();
        expect(song.title).toBe('Wuff');
    });
});

test('throws error for non-existing song', () => {
    return expect(inMemorySongRepository.getSong('doesnotexist'))
        .rejects.toBeTruthy();
});

test('provides setlist list', () => {
    return inMemorySongRepository.getSetlists().then(setlists => {
        expect(setlists).toBeTruthy();
        expect(setlists[0].title).toBe('Jimi Satans Schuhshop');
    });
});

test('has setlist', () => {
    return inMemorySongRepository.getSetlist('setlist1').then(setlist => {
        expect(setlist).toBeTruthy();
        expect(setlist.title).toBe('Jimi Satans Schuhshop');
    });
});

test('throws error for non-existing setlist', () => {
    return expect(inMemorySongRepository.getSetlist('doesnotexist'))
        .rejects.toBeTruthy();
});
