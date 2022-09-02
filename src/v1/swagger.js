const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Basic Meta Informations about our API
const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'DISNEY API', version: '1.0.0' },
  },
  apis: [
    './src/v1/routes/movieRoutes.js',
    './src/v1/routes/characterRoutes.js',
    './src/v1/routes/authRoutes.js',
    './src/database/Repository/movieRepository.js',
    './src/database/Repository/characterRepository.js',
    './src/database/Repository/userRepository.js',
  ],
}

// Docs in JSON format
const swaggerSpec = swaggerJSDoc(options)

// Function to setup our docs
const swaggerDocs = (app, port) => {
  // Route-Handler to visit our docs
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Make our docs in JSON format available
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  console.log(
    `Version 1 Docs are available on http://localhost:${port}/api/v1/docs`,
  )
}

module.exports = { swaggerDocs }
