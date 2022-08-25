const { sequelize } = require('../database/database')

beforeAll(async () => {
  await sequelize.sync()
})

beforeEach(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.sync({ force: true })
  await sequelize.close()
})
