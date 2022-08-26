const express = require('express')
const bodyParser = require('body-parser')
const characterRoutes = require('./v1/routes/characterRoutes')
const movieRoutes = require('./v1/routes/movieRoutes')

const app = express()

app.use(bodyParser.json())
app.use('/api/v1/characters', characterRoutes)
app.use('/api/v1/movies', movieRoutes)

app.all('*', (req, res) => {
  res.status(404).send({ errors: [{ message: 'Route not found' }] })
})

module.exports = { app }
