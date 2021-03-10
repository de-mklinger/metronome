import './songRepository';
import songRepository from "./songRepository";
import testFixtures from "./songRepository.testFixtures";

test('provides song list', () => {
  const songs = songRepository.getSongs();
  expect(songs).toBeTruthy();
  expect(songs[0].title).toBe(testFixtures.allSongs[0].title);
});

test('has existing song', () => {
  const song = songRepository.getSong('song1');
  expect(song).toBeTruthy();
  expect(song.title).toBe('Wuff');
});

test('throws error for non-existing song', () => {
  expect(() => songRepository.getSong('doesnotexist'))
      .toThrowError();
});

test('provides setlist list', () => {
  const setlists = songRepository.getSetlists();
  expect(setlists).toBeTruthy();
  expect(setlists[0].title).toBe('Jimi Satans Schuhshop');
});

test('has setlist', () => {
  const setlist = songRepository.getSetlist('setlist1')
  expect(setlist).toBeTruthy();
  expect(setlist.title).toBe('Jimi Satans Schuhshop');
});

test('throws error for non-existing setlist', () => {
  expect(() => songRepository.getSetlist('doesnotexist'))
      .toThrowError();
});
