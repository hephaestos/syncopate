/* eslint-disable no-console */
/**
 * @author Brandon T, Taylor R., Remy M., Jacob J., Daniel F.
 * @version 0.0.1
 * @description This is the API for the Syncopate client which handles user requests to either
 * create, join, or destroy music listening sessions. The API stores user session data within a
 * MongoDB cluster. The POST method ensures user is creating unique session name, and GET method
 * to join a session ensures session already exists and user has provided valid password.
 */
import swaggerJSDoc from 'swagger-jsdoc'; // Will be used for creating API specific documentation in the future
import pkg from 'swagger-ui-express'; // Will be used to generate nice HTML/CSS pages for documentation in future
import express from 'express'; // Express API library
import session from 'express-session'; // Used to store and manage user sessions
import MongoStore from 'connect-mongo'; // Database for backend storage of user data
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/extensions
import * as http from 'http';
import * as socketio from 'socket.io';
// eslint-disable-next-line import/extensions
import { sessionSecret, URL } from './secrets.js';

// eslint-disable-next-line import/extensions
import { SyncSessionModel, uniqueID } from './syncSessionModel.js';

const { serve, setup } = pkg;
const connectedUsers = new Map();

const options = {
    definition: {
        openapi: '3.0.0', // Future documentation will use OpenAPI specification 3.0.0
        info: {
            title: 'Syncopate API',
            version: '1.0.0',
        },
    },
    apis: ['./syncserver.js'],
};

const openapiSpecification = swaggerJSDoc(options);

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
    serveClient: true,
});

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
        collectionName: 'UIDs',
        autoRemove: 'native', // Default value for auto remove
        mongooseConnection: db,
    }),
}));

app.use(express.json()); // Allows for parsing of JSON data in request body
app.use('/API', serve, setup(openapiSpecification)); // Route to display API documentation, in the future

app.get('/', (req, res) => {
    res.sendFile('C:\\Users\\br4nd\\Desktop\\Syncopate\\syncopate\\server\\index.html');
});

io.on('connection', async (socket) => {
    try {
        const newUserID = socket.request.headers.cookie.replace('syncopate.sid=s%3A', '').split('.')[0];
        connectedUsers.set(socket.id, newUserID);
        await db
            .collection('UIDs')
            .updateOne({ _id: connectedUsers.get(socket.id) }, { $set: { currSession: null } });
        console.log(`Connected user: ${newUserID}`);
    } catch (e) {
        console.log(`Caught an error: ${e}`);
    }

    socket.on('chat message', (msg) => {
        console.log(msg);
        io.emit('chat message', msg);
    });

    socket.on('create session', async () => {
        let sessionID = uniqueID(); // Uniquely generated session ID
        const query = await db.collection('sessions').findOne({ _id: sessionID }); // See if session ID exists in DB
        // If we did not generate a unique ID, generate another
        if (query != null) sessionID = uniqueID();
        const userID = connectedUsers.get(socket.id);
        // Create new Syncopate session model for this user
        const userSession = new SyncSessionModel(userID);
        const userSessionExists = await db.collection('sessions').findOne({ 'userSession.uid': userID });

        // Make sure user has not already started hostng a session. If so, send an error message
        if (userSessionExists != null) {
            console.log('User cannot posses more than one session');
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
            await db
                .collection('UIDs')
                .updateOne({ _id: connectedUsers.get(socket.id) },
                    { $set: { currSession: sessionID } });
            console.log(`Session created with sessionID: ${sessionID}`);
        }
    });

    socket.on('disconnect', async () => {
        const disID = connectedUsers.get(socket.id); // The actual randomly generated userID
        try {
            const currUser = await db.collection('UIDs').findOne({ _id: disID }); // Grab Promise of user from DB, if they exist
            const currSess = currUser.currSession; // Current session user is in
            if (currSess != null) {
                let userInSess = await db.collection('sessions').findOne({ _id: currSess }); // See if session user is in exists
                if (userInSess != null) { // If user is in actual session
                    // Remove user from their current session
                    await db.collection('sessions').updateOne({ _id: currSess }, { $pull: { 'userSession.users': disID } });
                    userInSess = await db.collection('sessions').findOne({ _id: currSess }); // Refresh user list
                    // If session is empty when user leaves, delete it
                    if (userInSess.userSession.users.length === 0) {
                        await db.collection('sessions').deleteOne({ _id: currSess });
                    }
                }
            }
            await db.collection('UIDs').deleteOne({ _id: disID });
        } catch (e) {
            console.log('Failed to find user with this ID');
        }
        connectedUsers.delete(socket.id);
        console.log(`User ${disID} disconnected`);
    });

    socket.on('join session', async (sessionName) => {
        const currID = connectedUsers.get(socket.id);
        try {
            const currUser = await db.collection('UIDs').findOne({ _id: currID });
            if (currUser) {
                await db.collection('UIDs').updateOne({ _id: currID }, { $set: { currSession: sessionName } });
            }
            const reqSession = await db.collection('sessions').findOne({ _id: sessionName });
            if (reqSession) {
                await db.collection('sessions').updateOne({ _id: sessionName }, { $push: { 'userSession.users': currID } });
            }
        } catch (e) {
            console.log(`User does not exist: ${e}`);
        }
    });
});

// Start the server and begin listening on port 4000
server.listen(4000, () => {
    console.log('Listening');
});
