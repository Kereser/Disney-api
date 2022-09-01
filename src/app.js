const express = require('express')
const bodyParser = require('body-parser')
const characterRoutes = require('./v1/routes/characterRoutes')
const movieRoutes = require('./v1/routes/movieRoutes')
const authRoutes = require('./v1/routes/authRoutes')
const cookieSession = require('cookie-session')

const app = express()

app.use(bodyParser.json())
app.use(
  cookieSession({
    signed: false,
  }),
)

app.use('/api/v1/characters', characterRoutes)
app.use('/api/v1/movies', movieRoutes)
app.use('/api/v1/auth', authRoutes)

// app.all('*', (req, res) => {
//   res.status(404).send({ errors: [{ message: 'Route not found' }] })
// })

module.exports = { app }
