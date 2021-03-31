/**
* Backend is currently setup with pseduo get and create session HTTP protocols.
* Sessions will be implemented using express sessions / mongoDB for storing data
*/
import swaggerJSDoc from 'swagger-jsdoc';
import pkg from 'swagger-ui-express';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
// eslint-disable-next-line import/extensions
import bodyParser from 'body-parser';
import { sessionSecret, URL } from './secrets.js';

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

app.use(express.json());
app.use('/API', serve, setup(openapiSpecification));

/**
* Path constants
*/
const createPath = '/create-session'; // Creating session path

/**
* GET request (I think it should be POST) to create the new session
* using uid given by request parameters
* Returns response indicating the unique session ID
*/
app.post(createPath, (req, res) => {
    req.session.UserSession = {
        session_name: req.body.session_name,
        session_password: req.body.password,
    };
    res.send(`You just created a session with name: ${req.body.session_name}`);
});

/**
* Temporary express server location to debug/test backend. Currently server starts on localhost:4000
*/
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${port}`);
});
