/**
 * @classdesc This is the model to be used for storing Syncopate user sessions. Each session ID
 * will be uniquely generated and checked against the current database. Song and playback
 * status is tracked and can be changed, as well as the current list of users in the session.
 * @class SyncSessionModel is the model for the backend which holds the list of users,
 * owner of the session, current song playing, and status of playback
 * @argument uid The ID of the user who owns the session
 * @argument spotName The Spotify username of the user who owns the session
 * @constructor Creates new session with currSong as null and adds session owner
 * to list of users, and sets their ID as the session's owner ID
 */
class SyncSessionModel {
    constructor(uid, spotName) {
        this.uid = uid; // Holds userID
        this.users = []; // List of users in this Syncopate session
        this.users.push({ userID: uid, spotName }); // Add user who created session to session
        this.currSong = null; // Current song playing
        this.isPlaying = false; // Playback status
    }

    /**
     * Getter for current song playing in this session
     * @returns String The current song playing
     */
    getSong() {
        return this.currSong;
    }

    /**
     * Adds a new user to the Syncopate session
     * @param {*} uid The user ID which will be added to the Syncopate session
     */
    addUser(uid) {
        this.users.push(uid);
    }

    /**
     * Removes a user from this session's list of users
     * @param {*} uid The user ID which will be removed from the Syncopate session
     */
    removeUser(uid) {
        this.users.splice(this.users.indexOf(uid));
    }

    /**
     * Changes current playback status to opposite of current status
     * (i.e. either true for playing or false for not playing)
     */
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

export { SyncSessionModel, uniqueID }; // Export model and ID generator
