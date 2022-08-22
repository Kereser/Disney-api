import Sequelize from "sequelize"

export const sequelize = new Sequelize('disney', 'postgres', '112233dfg..', {
  host: 'localhost',
  dialect: 'postgres'
})


