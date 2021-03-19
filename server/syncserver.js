// Initial backend with example 'Hello World' function from Postman

const express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
const app = express()
const port = 4000
var identifier = 0
let currSessions = {}


//Maybe put PATH constants up here so requests can be made for specific pages / information
//Example: Session path -->  /:uid/:sessionid
const createPath = '/create-session/:uid'
const joinPath = '/join-session/:sid'

//POST request here for creating a new session.
//@params -> POST request should include userID of some kind (maybe Spotify login name/email?)
app.get(createPath, (req, res) => {
  if (currSessions[`${req.params.uid}`] == null) {
    currSessions[`${req.params.uid}`] = `${req.params.uid + identifier++}`
  }
  res.send(`You just created a session with unique ID: ${currSessions[req.params.uid]}`)
});

//GET(?) request for joining an existing session
app.get(joinPath, (req, res) => {
  Object.keys(currSessions).forEach(function(key) {
  if(currSessions[key] == req.params.sid) {
    res.send('This session exists!')
  }
});
  //res.send('This session does not exist!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

