class SyncSessionModel {
    constructor(uid) {
        this.uid = uid;
        this.users = [];
        this.users.push(uid);
        this.currSong = null;
        this.isPlaying = false;
    }

    getSong() {
        return this.currSong;
    }

    addUser(uid) {
        this.users.push(uid);
    }

    removeUser(uid) {
        this.users.splice(this.users.indexOf(uid));
    }

    changePlaybackStatus() {
        if (this.isPlaying === true) this.isPlaying = false;
        else this.isPlaying = true;
    }
}

/**
 * Code courtesy of https://gist.github.com/gordonbrander/2230317 and user alexmorleyfinch
 * @returns Unique String to be used as a session identifier
 */
function uniqueID() {
    function chr4() {
        return Math.random().toString(16).slice(-4);
    }
    return `${chr4()}`;
}

export { SyncSessionModel, uniqueID };
