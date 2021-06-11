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

test('setlist contains full songs', () => {
    return inMemorySongRepository.getSetlist('setlist1').then(setlist => {
        expect(setlist.songs).toBeTruthy();
        expect(setlist.songs.length).toBeGreaterThan(0);
        expect(setlist.songs.length).toBe(setlist.songIds.length);
        for (let i = 0; i < setlist.songIds.length; i++) {
            expect(setlist.songs[i].id).toBe(setlist.songIds[i]);
        }
        expect(setlist.songs[0].title).toBe('Spielchen');
    });
});

test('throws error for non-existing setlist', () => {
    return expect(inMemorySongRepository.getSetlist('doesnotexist'))
        .rejects.toBeTruthy();
});

test('provides app state', () => {
    return inMemorySongRepository.getAppState().then(appState => {
        expect(appState).toBeTruthy();
        expect(appState.song).toBeTruthy();
        expect(appState.song.bpm).toBeGreaterThan(0);
    });
});
