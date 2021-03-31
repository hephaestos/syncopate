/**
* Backend is currently setup with pseduo get and create session HTTP protocols.
* Sessions will be implemented using express sessions / mongoDB for storing data
*/
import swaggerJSDoc from 'swagger-jsdoc';
import pkg from 'swagger-ui-express';
import express from 'express';
import session from 'express-session';
import { sessionSecret, URL } from './secrets';

import MongoStore from 'connect-mongo';

const { serve, setup } = pkg;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Syncopate API',
            version: '1.0.0',
        },
    },
    apis: ['./syncserver.js'],
};

const openapiSpecification = swaggerJSDoc(options);

const app = express();
const port = 4000; // Debugging port
let identifier = 0; // Counter to create 'unique' IDs
const currSessions = {}; // Temp storage for sessions UIDs and SIDs

app.use(session({
    name: 'syncopate.sid',
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
    },
    store: new MongoStore({
        mongoUrl: URL,
        dbName: 'Syncopate',
        collectionName: 'sessions',
        autoRemove: 'native',
    }),
}));

app.use('/API', serve, setup(openapiSpecification));

/**
* Path constants
*/
const createPath = '/create-session/:uid'; // Creating session path

/**
* GET request (I think it should be POST) to create the new session
* using uid given by request parameters
* Returns response indicating the unique session ID
*/
app.post(createPath, (req, res) => {
    if (currSessions[`${req.params.uid}`] == null) {
        currSessions[`${req.params.uid}`] = `${req.params.uid + identifier++}`;
    }
    req.session.sess = {
        name: `${req.params.uid}`,
        password: `${identifier}`,
    };
    res.send(`You just created a session with unique ID: ${currSessions[req.params.uid]}`);
});

/**
* Temporary express server location to debug/test backend. Currently server starts on localhost:4000
*/
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${port}`);
});
