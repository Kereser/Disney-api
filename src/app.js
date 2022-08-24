const express = require('express')
const bodyParser = require('body-parser')
const characterRoutes = require('./v1/routes/characterRoutes.js')

const app = express()

app.use(bodyParser.json())
app.use('/api/v1/characters', characterRoutes)

app.all('*', (req, res) => {
  res.status(404).send({ errors: [{ message: 'Route not found' }] })
})

module.exports = { app }
