import {RepositoryImpl} from "./baseRepository.ts";

const localStorageRepositoryImpl: RepositoryImpl = {
    doGetSongs: async () => {
        return JSON.parse(window.localStorage.getItem("songs") || "[]");
    },

    doSaveSongs: async (songs) => {
        window.localStorage.setItem("songs", JSON.stringify(songs));
    },

    doGetSetlists: async () => {
        return JSON.parse(window.localStorage.getItem("setlists") || "[]");
    },

    doSaveSetlists: async (setlists) => {
        window.localStorage.setItem("setlists", JSON.stringify(setlists));
    },

    doGetAppState: async () => {
        let appStateJson = window.localStorage.getItem("appState");
        if (!appStateJson) {
            return null;
        } else {
            return JSON.parse(appStateJson);
        }
    },

    doSaveAppState: async (appState) => {
        window.localStorage.setItem("appState", JSON.stringify(appState));
    }
}

export default localStorageRepositoryImpl;
