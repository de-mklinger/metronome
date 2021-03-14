import {allSongs, allSetlists} from "./songRepository.testFixtures";

const songRepository = {
    getSongs: () => allSongs,
    getSong: id => findById(allSongs, id),
    getSetlists: () => allSetlists,
    getSetlist: id => findById(allSetlists, id)
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