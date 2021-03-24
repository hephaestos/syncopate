/**
* Backend is currently setup with pseduo get and create session HTTP protocols. 
* Sessions will be implemented using express sessions / mongoDB for storing data
*/
const express = require('express'); // Import expressJS

const app = express();
const port = 4000; // Debugging port
let identifier = 0; // Counter to create 'unique' IDs
let currSessions = {}; // Temp storage for sessions UIDs and SIDs

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
app.get(createPath, (req, res) => {
    if (currSessions[`${req.params.uid}`] == null) {
        currSessions[`${req.params.uid}`] = `${req.params.uid + identifier++}`;
    }
    res.send(`You just created a session with unique ID: ${currSessions[req.params.uid]}`);
});

/**
* GET request to join an existing session. Searches through current sessions to see if given SID matches 
* If session exists, sends back positive response to client
*/
app.get(joinPath, (req, res) => {
    Object.keys(currSessions).forEach(function(key) {
        if(currSessions[key] == req.params.sid) {
            res.send('This session exists!');
        }
    });
    // res.send('This session does not exist!')
});

/**
* Temporary express server location to debug/test backend. Currently server starts on localhost:4000
*/
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

