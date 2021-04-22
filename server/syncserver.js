/* eslint-disable camelcase */
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
import request from 'request';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import querystring from 'querystring';
import {
    sessionSecret, URL, client_id, client_secret,
} from './secrets.js'; // Holds private backend information not to be displayed on GitHub

const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // Future documentation will use OpenAPI specification 3.0.0
        info: {
            title: 'Syncopate API',
            version: '1.0.0',
        },
    },
    apis: ['./syncserver.js'],
};
const { serve, setup } = pkg;
const openapiSpecification = swaggerJSDoc(swaggerOptions);
const app = express();
const port = 4000; // Debugging port, will be hosted on private server in future
const redirect_uri = 'http://localhost:4000/callback';
const frontend_uri = 'http://localhost:3000';
const stateKey = 'spotify_auth_state';

const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

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
        collectionName: 'sessions',
        autoRemove: 'native', // Default value for auto remove
        mongooseConnection: db,
    }),
}));

app.use(express.json()) // Allows for parsing of JSON data in request body
    .use('/API', serve, setup(openapiSpecification)) // Route to display API documentation, in the future
    .use(cors())
    .use(cookieParser());

// Path constants
const createPath = '/create-session';

/**
* @summary This POST method is used to create a new user session on the MongoDB backend using a
* user provided session name and password for the session. *In future* will verify session name
* is unique
* @returns Success response if session was successfully created
* @callback (req,res) Used to parse incoming req data and send success/fail responses
* @requires createPath The route for this POST request
* @todo Implement session name checking to avoid duplicates
*/
app.post(createPath, async (req, res) => {
    const query = { session: { $regex: `.*${req.body.session_name}` } };
    const name = await db.collection('sessions').findOne(query);
    if (name == null) {
        req.session.UserSession = {
            session_name: req.body.session_name,
            session_password: req.body.password,
        };
        res.send('Session created');
    } else {
        res.send('Name already being used!');
    }
});

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = 'user-read-private user-read-email';
    res.redirect(`https://accounts.spotify.com/authorize?${
        querystring.stringify({
            response_type: 'code',
            client_id,
            scope,
            redirect_uri,
            state,
        })}`);
});

app.get('/callback', (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect(`${frontend_uri}/#${
            querystring.stringify({
                error: 'state_mismatch',
            })}`);
    } else {
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
    }
});

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
* @requires port The default port to connect to. Temporarily set to 4000
* @returns Logs to console upon successful connection to server. Temporarily localhost
*/
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${port}`);
});
