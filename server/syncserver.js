/**
 * @author Brandon T, Taylor R., Remy M., Jacob J., Daniel F.
 * @version 0.0.1
 * @description This is the API for the Syncopate client which handles user requests to either
 * create, join, or destroy music listening sessions. The API stores user session data within a
 * MongoDB cluster. The IO 'connection' ensures user is creating unique session name, and the IO
 * 'Join Session' to join a session ensures session already exists and user has provided
 * valid password.
 */
import express from 'express'; // Express API library
import session from 'express-session'; // Used to store and manage user sessions
import MongoStore from 'connect-mongo'; // Database for backend storage of user data
import mongoose from 'mongoose'; // Allows for use of NoSQL commands to pull from Mongo DB
import querystring from 'querystring'; // Used to make queries to Spotify
import request from 'request'; // Make requests to Spotify API

import * as http from 'http';
import * as socketio from 'socket.io'; // Module to handle Syncopate music sessions
import {
    sessionSecret, URL, client_id, client_secret,
} from './secrets.js'; // Server/backend secrets for server consturctor and client secrets

import { SyncSessionModel, uniqueID } from './syncSessionModel.js'; // Model for Syncopate sessions and generating IDs

// Constructing express server using sockets.io
const app = express();
const server = http.createServer(app);

// Client URIs
const redirect_uri = 'http://localhost:4000/callback';
const frontend_uri = 'http://localhost:3000';
const stateKey = 'spotify_auth_state';
const io = new socketio.Server(server, {
    serveClient: true,
    cors: {
        origin: frontend_uri,
        methods: ['GET', 'POST'],
    },
    pingTimeout: 60000, // Ping timeout and interval allow for longer socket requests
    pingInterval: 25000,
});

// Connect our databse backend to the server
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
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
        collectionName: 'express', // Where express user IDs will be stored
        autoRemove: 'native', // Default value for auto remove
        mongooseConnection: db,
    }),
})).use(express.static('public'));

/**
 * @summary Route to redirect user to Spotify site to login and authorize (User needs premium)
 * @param req The request from the client side containing headers, etc.
 * @param res The response to send back to the client
 * @returns Sends user to Spotify domain
 */
app.get('/login', (req, res) => {
    // your application requests authorization
    const scope = 'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state user-library-read user-library-modify';
    res.redirect(`https://accounts.spotify.com/authorize?${
        querystring.stringify({
            response_type: 'code',
            client_id,
            scope,
            redirect_uri,
        })}`);
});

/**
 *
 */
app.get('/callback', (req, res) => {
    const code = req.query.code || null;

    res.clearCookie(stateKey);
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code,
            redirect_uri,
            grant_type: 'authorization_code',
        },
        headers: {
            Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
        },
        json: true,
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const { access_token } = body;
            const { refresh_token } = body;

            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { Authorization: `Bearer ${access_token}` },
                json: true,
            };

            // use the access token to access the Spotify Web API
            request.get(options, (e, r, b) => {
                console.log(b);
            });

            // we can also pass the token to the browser to make requests from there
            res.redirect(`${frontend_uri}/#${
                querystring.stringify({
                    access_token,
                    refresh_token,
                })}`);
        } else {
            res.redirect(`${frontend_uri}/#${
                querystring.stringify({
                    error: 'invalid_token',
                })}`);
        }
    });
});

/**
 *
 */
app.get('/refresh_token', (req, res) => {
    // requesting access token from refresh token
    const { refreshToken } = req.query;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}` },
        form: {
            grant_type: 'refresh_token',
            refreshToken,
        },
        json: true,
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const { accessToken } = body;
            res.send({
                accessToken,
            });
        }
    });
});

/**
 * @description This is the entry point for clients when they reach the Syncopate website.
 *  A new socket is established and a unique ID is generated for the user and stored on the
 * database. The user has the ability to create, join, or leave rooms using their socket
 * connection. There is also a test socket listener to test sending "messages" between a
 * group of users in a room.
 * @param socket Socket connection from client side
 */
const connection = async (socket) => {
    try {
        const newUserID = socket.id; // User ID is set as the unique socket ID

        // Find user in database and make sure
        // current session is set to null until they join a room
        await db
            .collection('UIDs')
            .insertOne({
                _id: newUserID,
                spotifyID: null, // User has not logged in to Spotify yet
                created: new Date(), // Set date as now
                currSession: null,
            });
        console.log(`Connected user: ${newUserID}`);
    } catch (e) {
        console.log(`Caught an error: ${e}`);
    }

    /**
     * @description Method to create a unique session for the user and add themselves to the room.
     * Also sends the session name/code back to the user via socket.emit to session name
     * can be given to those who want to join the room
     * @emit Sends unique session ID back to user who created session
     * @emit Sends error back to client if user already has a session under their ID
     */
    const createSession = async () => {
        let sessionID = uniqueID(); // Uniquely generated session ID
        const query = await db.collection('sessions').findOne({ _id: sessionID }); // See if session ID exists in DB

        // If we did not generate a unique ID, generate another. TODO: **Replace this method**
        if (!query) sessionID = uniqueID();

        const userID = socket.id; // User ID is socket ID
        const spotUsername = await db.collection('UIDs').findOne({ id: socket.id }).spotifyID; // Grab Spotify ID

        // Create new session model for this user,
        // initialize session owner, and add them to users
        const userSession = new SyncSessionModel(userID, spotUsername);
        const userSessionExists = await db.collection('sessions').findOne({ 'userSession.uid': userID });

        // Make sure user has not already started hostng a session. If so, send an error message
        if (userSessionExists) {
            console.log('User cannot posses more than one session');
            // Error message sent to user if they already have session
            io.to(sessionID).emit('create session', 'Error: User already created session');
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
            await db.collection('UIDs').updateOne({ _id: socket.id }, { $set: { currSession: sessionID } });
            console.log(`Session created with sessionID: ${sessionID}`);

            io.to(sessionID).emit('create session', sessionID); // Send back session name to user
        }
        socket.join(sessionID); // Add this user/socket to a room with their session ID
    };
    socket.on('create session', createSession);

    /**
     * @description Method which is called automatically when the user disconnects from a session
     * (i.e. they close out of their browser or by other means). Removes socket/user from their
     * current session automatically. If the session is empty, deletes the session from the DB.
     * @param reason The reason for causing the client to disconnect.
     */
    const disconnect = async (reason) => {
        const disID = socket.id;
        try {
            const currUser = await db.collection('UIDs').findOne({ _id: disID }); // Grab Promise of user from DB, if they exist
            const currSess = currUser.currSession; // Current session user is in

            if (currSess) {
                let userInSess = await db.collection('sessions').findOne({ _id: currSess }); // See if session user is in exists
                if (userInSess) { // If user is in actual session
                    // Remove user from their current session
                    await db.collection('sessions').updateOne({ _id: currSess }, { $pull: { 'userSession.users': { userID: disID } } });
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
        console.log(`User ${disID} disconnected with reason: ${reason}`); // Disconnect reasoning logged
    };
    socket.on('disconnect', disconnect); // Caller for disconnecting

    /**
     * @description Method for users to be able to join other, existing sessions.
     * Checks to make sure the session exists, and if it does, add user's socket
     * to room and adds them to room's DB.
     * @emit Sends list of all users' Spotify usernames who are currently connected to room, back
     * to everyone in that room
     * @param sessionName The session ID/name which is being joined by the client
     */
    const joinSession = async (sessionName) => {
        const currID = socket.id;
        try {
            const currUser = await db.collection('UIDs').findOne({ _id: currID }); // Make sure user exists

            if (currUser) {
                const reqSession = await db.collection('sessions').findOne({ _id: sessionName });

                // If session user is looking for exists,
                // Grab user objects in array
                if (reqSession) {
                    // If user exists, change their current session to the one they are joining
                    await db.collection('UIDs').updateOne({ _id: currID }, { $set: { currSession: sessionName } });
                    // Grab spotify ID
                    const spotUsername = await db.collection('UIDs').findOne({ id: socket.id }).spotifyID;
                    // Add user to session
                    await db.collection('sessions').updateOne({ _id: sessionName }, { $push: { 'userSession.users': { currID, spotUsername } } });
                    socket.join(sessionName); // Add user's socket to room

                    // Grab current users in session
                    let usersInSession = await db.collection('sessions').findOne({ _id: sessionName });
                    // Grab user objects in array
                    usersInSession = usersInSession.userSession.users;
                    const users = [];

                    // For each user, append their username to array
                    usersInSession.array.forEach((element) => {
                        users.push(element.spotName);
                    });

                    // Send usernames back to clients in room user joined
                    io.to(sessionName).emit('join session', users);
                }
            }
        } catch (e) {
            console.log(`User does not exist: ${e}`);
        }
    };
    socket.on('join session', joinSession); // Caller for joining session

    /**
     * @description Sends request to Spotify API to authenticate client. Then, sends
     * the client's Spotify username back to the client, which is later used in the DB
     * @emit Sends client's Spotify username back to client upon success
     */
    const getSpotifyID = async (access_token) => {
        const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { Authorization: `Bearer ${access_token}` },
            json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, (err, res, body) => {
            console.log('err');
            console.log(err);
            console.log('res');
            console.log(res);
            console.log('body');
            console.log(body);

            io.to(socket.id).emit('get spotify id', body); // Send Spotify username to client

            // Update client's spotifyID field in databse with their username
            db.collection('UIDs').updateOne({ _id: socket.id }, { $set: { spotifyID: body.id } });
        });
    };
    socket.on('get spotify id', getSpotifyID); // Caller for getting Spotify ID
};
io.on('connection', connection);

// Start the server and begin listening on port 4000. Will need to be setup with Syncopate
// website for production
server.listen(4000, () => {
    console.log('Listening');
});

export { connection as default };
