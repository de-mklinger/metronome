import {allSongs} from "./inMemoryRepository.testFixtures.js";
import newRepository from "./baseRepository.js";
import inMemoryRepositoryImpl from "./inMemoryRepositoryImpl.js";
import {expect, test} from "vitest";

const inMemorySongRepository = newRepository(inMemoryRepositoryImpl);

test('provides song list', async () => {
    const songs = await inMemorySongRepository.getSongs();
    expect(songs).toBeTruthy();
    expect(songs[0].title).toBe(allSongs[0].title);
});

test('has existing song', async () => {
    const song = await inMemorySongRepository.getSong('wuff');
    expect(song).toBeTruthy();
    expect(song.title).toBe('Wuff');
});

test('throws error for non-existing song', async () => {
    await expect(inMemorySongRepository.getSong('doesnotexist'))
        .rejects.toBeTruthy();
});

test('provides setlist list', async () => {
    const setlists = await inMemorySongRepository.getSetlists();
    expect(setlists).toBeTruthy();
    expect(setlists[0].title).toBe('Jimi Satans Schuhshop');
});

test('has setlist', async () => {
    const setlist = await inMemorySongRepository.getSetlist('setlist1');
    expect(setlist).toBeTruthy();
    expect(setlist.title).toBe('Jimi Satans Schuhshop');
});

test('setlist contains full songs', async () => {
    const setlist = await inMemorySongRepository.getSetlist('setlist1');
    expect(setlist.songs).toBeTruthy();
    expect(setlist.songs.length).toBeGreaterThan(0);
    expect(setlist.songs.length).toBe(setlist.songIds.length);
    for (let i = 0; i < setlist.songIds.length; i++) {
        expect(setlist.songs[i].id).toBe(setlist.songIds[i]);
    }
    expect(setlist.songs[0].title).toBe('Spielchen');
});

test('throws error for non-existing setlist', async () => {
    await expect(inMemorySongRepository.getSetlist('doesnotexist'))
        .rejects.toBeTruthy();
});

test('provides app state', async () => {
    const appState = await inMemorySongRepository.getAppState();
    expect(appState).toBeTruthy();
    expect(appState.song).toBeTruthy();
    expect(appState.song.bpm).toBeGreaterThan(0);
});
