/* eslint-disable new-cap */
/**
* Backend is currently setup with pseduo get and create session HTTP protocols.
* Sessions will be implemented using express sessions / mongoDB for storing data
*/
// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUI = require('swagger-ui-express');

// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Syncopate API',
//             version: '1.0.0',
//         },
//     },
//     apis: ['./syncserver.js'],
// };

// const openapiSpecification = swaggerJSDoc(options);
const express = require('express'); // Import expressJS
const session = require('express-session');
// const hashes = require('jshashes');

const MongoStore = require('connect-mongo');

const app = express();
const port = 4000; // Debugging port
let identifier = 0; // Counter to create 'unique' IDs
const currSessions = {}; // Temp storage for sessions UIDs and SIDs

app.use(session({
    // genid(req) {
    //     const uid = req.params.uid.toString;
    //     const SHA1 = new hashes.SHA1.b64(uid);
    //     return SHA1;
    // },
    name: 'syncopate.sid',
    secret: 'hc489ser3fghKL4c',
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://thombran:Syncopate@cluster0.vec2a.mongodb.net/Syncopate?retryWrites=true&w=majority',
        dbName: 'Syncopate',
        collectionName: 'sessions',
        autoRemove: 'native',
    }),
}));

// app.use('/API', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

/**
* Path constants
*/
const createPath = '/create-session/:uid'; // Creating session path
const joinPath = '/join-session/:sid'; // Joining session path

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
        password: 'finnigan',
    };
    res.send(`You just created a session with unique ID: ${currSessions[req.params.uid]}`);
});

/**
* GET request to join an existing session.
* Searches through current sessions to see if given SID matches
* If session exists, sends back positive response to client
*/
app.get(joinPath, (req, res) => {
    // Object.keys(currSessions).forEach((key) => {
    //     if (currSessions[key] === req.params.sid) {
    //         res.send('This session exists!');
    //     }
    // });
    // // res.send('This session does not exist!')

    res.send(req.session.sess);
});

/**
* Temporary express server location to debug/test backend. Currently server starts on localhost:4000
*/
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${port}`);
});
