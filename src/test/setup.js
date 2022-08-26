const { sequelize } = require('../database/database')

beforeAll(async () => {
  await sequelize.sync({ force: true })
})

beforeEach(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.drop()
  await sequelize.close()
})
