const { app } = require('./app')
const { sequelize } = require('./database/database')
const { swaggerDocs: V1SwaggerDocs } = require('./v1/swagger')

async function main() {
  try {
    await sequelize.sync({ alter: true })
    app.listen(3000, () => {
      console.log('Server listening on 3000')

      V1SwaggerDocs(app, 3000)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
