const { DataTypes } = require('sequelize')
const { sequelize } = require('../database')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      len: [4],
    },
  },
})

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get())

  delete values.password
  return values
}

module.exports = { User }
