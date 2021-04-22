import io from 'socket.io-client';

let sessionID;
let users;
const socket = io.connect('http://localhost:4000');

export default {
    sessionID,
    users,
    createSession() {
        socket.emit('create session');
        socket.on('create session', (res) => {
            sessionID = res;
        });
    },
    joinSession(code) {
        socket.emit('join session', code);
        socket.on('join session', (res) => {
            sessionID = code;
            users = res;
        });
    },
};
