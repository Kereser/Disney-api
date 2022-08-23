import app from './app.js'
import { sequelize } from './database/database.js'

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
