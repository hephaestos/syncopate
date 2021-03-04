// Initial backend with example 'Hello World' function from Postman

const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Welcome to Syncopate!!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//Maybe put PATH constants up here so requests can be made for specific pages / information
//Example: Session path -->  /:uid/:sessionid


//POST request here for creating a new session

//GET(?) request for joining an existing session
