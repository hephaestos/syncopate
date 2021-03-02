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
