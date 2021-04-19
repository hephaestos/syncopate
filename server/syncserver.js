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
import express, { json } from 'express'; // Express API library
import session from 'express-session'; // Used to store and manage user sessions
import MongoStore from 'connect-mongo'; // Database for backend storage of user data
import mongoose from 'mongoose';

// eslint-disable-next-line import/extensions
import { sessionSecret, URL } from './secrets.js'; // Holds private backend information not to be displayed on GitHub
import syncopateID from sessionSecret.js
const { serve, setup } = pkg;

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
const port = 4000; // Debugging port, will be hosted on private server in future

mongoose.connect(URL);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

/**
 * @summary Setup the Express Session client for the user, initialize cookie, and
 * connect to MongoDB backend. Initializes various settings for express sessions and store
 */
app.use(session({
    name: 'Syncopate.sid',
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

// Path constants
const createPath = '/create-session';
const joinPath = '/join-session';
const createUIDPath = '/create-UID';
const createSyncopateSession = '/create-session';

/**
 * @summary This POST method is used to create a new user session on the MongoDB backend using a
 * user provided session name and password for the session. *In future* will verify session name
 * is unique
 * @returns Success response if session was successfully created
 * @callback (req,res) Used to parse incoming req data and send success/fail responses
 * @requires createPath The route for this POST request
 * @todo Implement session name checking to avoid duplicates
 */
app.post(createUIDPath, (req, res) => {
    res.status(204).send('OK');
});

/**
 * POST method to insert/create a new Syncopate session on the backend
 */
app.post(createSyncopateSession, async (req, res) => {
    let sessionID = uniqueID(); // Uniquely generated session ID
    const query = await db.collection('sessions').findOne({ _id: sessionID }); // See if session ID exists in DB

    // If we did not generate a unique ID, generate another
    if (query != null) sessionID = uniqueID();
    const userID = req.sessionID;

    // Create new Syncopate session model for this user
    const userSession = new SyncSessionModel(userID);
    const userSessionExists = await db.collection('sessions').findOne({ 'userSession.uid': userID });

    // Make sure user has not already started hostng a session. If so, send an error message
    if (userSessionExists != null) {
        res.status(400).send('User cannot possess more than one session');
    } else {
        res.send('Name already being used!');  
    }
});

app.get(joinPath, async(req, res) => {
    const queryUserName = { session: { $regex: '.*' + `${req.body.session_name}` } };
    const name = await db.collection('sessions').findOne(queryUserName);
    if(name != null)
    {
        const userSession = JSON.parse(JSON.stringify(name));
        const sessionInfo = JSON.parse(userSession.session);
    
        if(req.body.password === sessionInfo.UserSession.session_password){
            res.send('Accepted');
        }
        else
        {
            res.send('Incorrect Password.');
        }
    }
    else 
    {
        res.send('Session not available.');
    }
    
        db.collection('sessions').insertOne({
            _id: sessionID,
            userSession, // Creating a userSession object in newly created doc
        },
        (error) => {
            if (error) res.send(error);
        });
    res.status(200).send(`Session created with sessionID: ${sessionID}`);
});

expressSession = { 
    "session_id": "riegert", "users": ""
};

if(syncopateID == sessionID)
{
    //add the user to the list
    userList = expressSession["users"];
    userList = userList.concat(", " + userSession);
}
else{
    res.send('Not a valid session. Please create or rejoin.');
}

/**
 * @requires port The default port to connect to. Temporarily set to 4000
 * @returns Logs to console upon successful connection to server. Temporarily localhost
 */
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${port}`);
});
