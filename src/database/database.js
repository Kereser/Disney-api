const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('disney', 'postgres', '112233dfg..', {
  host: 'localhost',
  dialect: 'postgres',
})

module.exports = {
  sequelize,
}
