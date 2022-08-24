const { app } = require('./app')
const { sequelize } = require('./database/database')

//! En el archivo de test, forzar la sincronizacion y asi podria crear las tablas antes de todas las pruebas.
async function main() {
  try {
    await sequelize.sync({ alert: true })
    app.listen(3000, () => {
      console.log('Server listening on 3000')
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
