import newRepository from "./baseRepository";
import localStorageRepositoryImpl from "./localStorageRepositoryImpl";

const songRepository = newRepository(localStorageRepositoryImpl);
// const songRepository = newRepository(inMemorySongRepositoryImpl);

export default songRepository;