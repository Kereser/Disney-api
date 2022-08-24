const { DataTypes } = require('sequelize')
const { sequelize } = require('../database')

const Genre = sequelize.define('Genre', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: DataTypes.STRING,
})

module.exports = {
  Genre,
}
