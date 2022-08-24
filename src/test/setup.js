const Sequelize = require('sequelize')

const sequelize = new Sequelize('disney', 'postgres', '112233dfg..', {
  host: 'localhost',
  dialect: 'postgres',
})

beforeEach(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.close()
})
