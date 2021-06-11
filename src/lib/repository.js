import newRepository from "./baseRepository";
import localStorageRepositoryImpl from "./localStorageRepositoryImpl";

const repository = newRepository(localStorageRepositoryImpl);

export default repository;