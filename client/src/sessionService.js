import io from 'socket.io-client';

let sessionID;
const socket = io.connect('http://localhost:4000');

export default {
    sessionID,
    createSession() {
        socket.emit('create session');
        socket.on('create session', (res) => {
            sessionID = res;
        });
    },
};
