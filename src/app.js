import express from 'express'
import bodyParser from 'body-parser'
import characterRoutes from './v1/routes/characterRoutes.js'

const app = express()

app.use(bodyParser.json())
app.use('/api/v1/characters', characterRoutes)

export default app
