import testFixtures from "./songRepository.testFixtures";

const songRepository = {
    getSongs: () => testFixtures.allSongs,
    getSong: id => findById(testFixtures.allSongs, id),
    getSetlists: () => testFixtures.allSetlists,
    getSetlist: id => findById(testFixtures.allSetlists, id)
}

const findById = (haystack, id) => {
    const found = haystack.find(item => item.id === id);
    if (!found) {
        throw new Error('Not found: ' + id);
    }
    return found;
    // expression `haystack.find(..) ?? throw new Error(..)` not supported:
    // "Support for the experimental syntax 'throwExpressions' isn't currently enabled"
}

export default songRepository;