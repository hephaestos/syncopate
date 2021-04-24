/**
 * @author Brandon T, Taylor R., Remy M., Jacob J., Daniel F.
 * @version 0.0.1
 * @description Provides session managing functionality to components.
 */
import io from 'socket.io-client';

/** The ID of the session joined by the user */
let sessionID;
/** An array of users in the current session */
let users;
/** The socket connection to the backend server */
const socket = io.connect('http://localhost:4000');

export default {
    /**
     * @summary Getter for sessionID
     * @returns The sessionID
     */
    getSessionId() {
        return sessionID;
    },

    /**
     * @summary Getter for users
     * @returns An array of users in the current session
     */
    getUsers() {
        return users;
    },

    /**
     * @summary Creates a new session and stores the returned session ID
     */
    createSession() {
        socket.emit('create session');
        socket.on('create session', (res) => {
            sessionID = res;
        });
    },

    /**
     * @summary Creates a new session and stores the returned session ID
     * @param code - The room code of the session to join
     */
    joinSession(code) {
        sessionID = code;
        socket.emit('join session', code);
        socket.on('join session', (res) => {
            users = res;
        });
    },

    /**
     * @summary Gets the spotify id of the current user
     * @param access_token - The access token for the Spotify API
     * @param callback - A callback function to handle the resulting data
     */
    getSpotifyId(access_token, callback) {
        socket.emit('get spotify id', access_token);
        socket.on('get spotify id', (body) => {
            callback(body.id);
        });
    },
};
