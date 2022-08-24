const { DataTypes } = require('sequelize')
const { sequelize } = require('../database')
const { Movie } = require('./Movie')

const Character = sequelize.define('Character', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  image: DataTypes.STRING,
  name: { type: DataTypes.STRING, allowNull: false },
  age: DataTypes.INTEGER,
  weight: DataTypes.FLOAT,
  history: DataTypes.STRING,
})

Character.belongsToMany(Movie, { through: 'CharacterMovies' })
Movie.belongsToMany(Character, { through: 'CharacterMovies' })

module.exports = {
  Character,
}
