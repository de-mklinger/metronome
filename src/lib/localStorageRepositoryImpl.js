const localStorageRepositoryImpl = {
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
    }
}

export default localStorageRepositoryImpl;