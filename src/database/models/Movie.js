import { DataTypes } from 'sequelize'
import { sequelize } from '../database.js'
import { Character } from './Character.js'
import { Genre } from './Genre.js'

export const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  image: DataTypes.STRING,
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  calification: DataTypes.INTEGER,
})

Movie.belongsToMany(Genre, { through: 'MovieGenres' })
Genre.belongsToMany(Movie, { through: 'MovieGenres' })
