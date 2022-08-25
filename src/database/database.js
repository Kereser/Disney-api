const { Sequelize } = require('sequelize')
require('dotenv').config()

const DBNAME =
  process.env.NODE_ENV === 'test'
    ? process.env.POSTGRES_TEST_DB_NAME
    : process.env.POSTGRES_DEV_DB_NAME

const sequelize = new Sequelize(DBNAME, 'postgres', '112233dfg..', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
})

module.exports = {
  sequelize,
}
