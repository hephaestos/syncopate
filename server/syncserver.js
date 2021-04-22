/* eslint-disable no-console */
/**
 * @author Brandon T, Taylor R., Remy M., Jacob J., Daniel F.
 * @version 0.0.1
 * @description This is the API for the Syncopate client which handles user requests to either
 * create, join, or destroy music listening sessions. The API stores user session data within a
 * MongoDB cluster. The POST method ensures user is creating unique session name, and GET method
 * to join a session ensures session already exists and user has provided valid password.
 */
import express from 'express'; // Express API library
import session from 'express-session'; // Used to store and manage user sessions
import MongoStore from 'connect-mongo'; // Database for backend storage of user data
import mongoose from 'mongoose'; // Allows for use of NoSQL commands to pull from Mongo DB

// eslint-disable-next-line import/extensions
import * as http from 'http';
import * as socketio from 'socket.io'; // Module to handle Syncopate music sessions
// eslint-disable-next-line import/extensions
import { sessionSecret, URL } from './secrets.js'; // Server/backend secrets for server consturctor

// eslint-disable-next-line import/extensions
import { SyncSessionModel, uniqueID } from './syncSessionModel.js'; // Model for Syncopate sessions and generating IDs

const connectedUsers = new Map(); // Map holds { socket.id : express session ID}

// Constructing express server using sockets.io
const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
    serveClient: true,
});

// Connect our databse backend to the server
mongoose.connect(URL);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

/**
 * @summary Setup the Express Session client for the user, initialize cookie, and
 * connect to MongoDB backend. Initializes various settings for express sessions and store
 */
app.use(session({
    name: 'syncopate.sid',
    secret: sessionSecret,
    resave: true, // Forces session to be saved to store, even if not modified during req
    saveUninitialized: true, // Uninitialized sessions still saved to store
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Max length user session will be remebered is 24H
        secure: false, // Not to be sent over HTTPS, currently
    },
    store: new MongoStore({
        mongoUrl: URL,
        dbName: 'Syncopate',
        collectionName: 'UIDs', // Where user IDs will be stored
        autoRemove: 'native', // Default value for auto remove
        mongooseConnection: db,
    }),
}));

/**
 * Test route for site landing page in order to test various API functionality. Can be removed
 * for release
 */
app.get('/', (req, res) => {
    res.sendFile('C:\\Users\\br4nd\\Desktop\\Syncopate\\syncopate\\server\\index.html'); // Load HTML page
});

/**
 * @description This is the entry point for clients when they reach the Syncopate website.
 *  A new socket is established and a unique ID is generated for the user and stored on the
 * database. The user has the ability to create, join, or leave rooms using their socket
 * connection. There is also a test socket listener to test sending "messages" between a
 * group of users in a room.
 * @emits chat_message Sends message back to users when message is received. For testing
 */
io.on('connection', async (socket) => {
    try {
        // Grab the unique user ID from the socket header being sent to the server
        const newUserID = socket.request.headers.cookie.split('; ')[1].replace('syncopate.sid=s%3A', '').split('.')[0];
        console.log(newUserID);
        connectedUsers.set(socket.id, newUserID); // Add user ID to map with their socket ID
        // Find user in database and make sure current session is set to null until they join a room
        await db
            .collection('UIDs')
            .updateOne({ _id: connectedUsers.get(socket.id) }, { $set: { currSession: null } });
        console.log(`Connected user: ${newUserID}`);
    } catch (e) {
        console.log(`Caught an error: ${e}`);
    }

    // Test method to send messages to all users connected to the server
    socket.on('chat message', (msg) => {
        console.log(msg);
        io.emit('chat message', msg); // Send msg back to all users
    });

    /**
     * Method to create a unique session for the user and add themselves to the room.
     * For production/implementation of Spotify need to send session name back to socket
     */
    socket.on('create session', async () => {
        let sessionID = uniqueID(); // Uniquely generated session ID
        const query = await db.collection('sessions').findOne({ _id: sessionID }); // See if session ID exists in DB

        // If we did not generate a unique ID, generate another. TODO: **Replace this method**
        if (query != null) sessionID = uniqueID();

        const userID = connectedUsers.get(socket.id); // Grab userID from global map
        // Create new Syncopate session model for this user
        const userSession = new SyncSessionModel(userID); // Create new session model for this user
        const userSessionExists = await db.collection('sessions').findOne({ 'userSession.uid': userID });

        // Make sure user has not already started hostng a session. If so, send an error message
        if (userSessionExists != null) {
            console.log('User cannot posses more than one session');
        // Otherwise, create a session on the backend
        } else {
            db.collection('sessions').insertOne({
                _id: sessionID,
                // This is used to keep track of when the session was created and auto remove it
                created: new Date(),
                userSession, // Creating a userSession object in newly created doc
            },
            (error) => {
                if (error) console.log(error);
            });
            // Change user's current session to newly created session ID
            await db
                .collection('UIDs')
                .updateOne({ _id: connectedUsers.get(socket.id) },
                    { $set: { currSession: sessionID } });
            console.log(`Session created with sessionID: ${sessionID}`);
        }
        socket.join(sessionID); // Add this user/socket to a room with their session ID
    });

    /**
     * Method which is called automatically when the user disconnects from a session
     * (i.e. they close out of their browser or by other means). Removes socket/user from their
     * current session automatically. If the session is empty, deletes the session from the DB.
     */
    socket.on('disconnect', async () => {
        const disID = connectedUsers.get(socket.id); // The actual randomly generated userID
        try {
            const currUser = await db.collection('UIDs').findOne({ _id: disID }); // Grab Promise of user from DB, if they exist
            const currSess = currUser.currSession; // Current session user is in
            if (currSess) {
                let userInSess = await db.collection('sessions').findOne({ _id: currSess }); // See if session user is in exists
                if (userInSess) { // If user is in actual session
                    // Remove user from their current session
                    await db.collection('sessions').updateOne({ _id: currSess }, { $pull: { 'userSession.users': disID } });
                    userInSess = await db.collection('sessions').findOne({ _id: currSess }); // Refresh user list
                    socket.leave(currSess); // Remove user from socket room
                    // If session is empty when user leaves, delete it
                    if (userInSess.userSession.users.length === 0) {
                        await db.collection('sessions').deleteOne({ _id: currSess });
                    }
                }
            }
            await db.collection('UIDs').deleteOne({ _id: disID }); // Delete user from DB of connected users
        } catch (e) {
            console.log('Failed to find user with this ID');
        }
        connectedUsers.delete(socket.id);
        console.log(`User ${disID} disconnected`);
    });

    /**
     * Method for users to be able to join other, existing sessions. Checks to make sure
     * the session exists, and if it does, add user's socket to room and adds them to room's DB
     */
    socket.on('join session', async (sessionName) => {
        const currID = connectedUsers.get(socket.id);
        try {
            const currUser = await db.collection('UIDs').findOne({ _id: currID }); // Make sure user exists
            if (currUser) {
                const reqSession = await db.collection('sessions').findOne({ _id: sessionName });
                // If session user is looking for exists, add them to the session's list of users
                if (reqSession) {
                    // If user exists, change their current session to the one they are joining
                    await db.collection('UIDs').updateOne({ _id: currID }, { $set: { currSession: sessionName } });
                    await db.collection('sessions').updateOne({ _id: sessionName }, { $push: { 'userSession.users': currID } });
                    socket.join(sessionName); // Add user's socket to room
                }
            }
        } catch (e) {
            console.log(`User does not exist: ${e}`);
        }
    });
});

// Start the server and begin listening on port 4000. Will need to be setup with Syncopate
// website for production
server.listen(4000, () => {
    console.log('Listening');
});
