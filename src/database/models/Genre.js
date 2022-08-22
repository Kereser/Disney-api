import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js'

export const Genre = sequelize.define('Genre', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: DataTypes.STRING
})