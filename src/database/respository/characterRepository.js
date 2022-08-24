import { dbError } from '../../errors/errorsMessages.js'
import { Character } from '../models/Character.js'

const getAllCharacters = async () => {
  try {
    const res = await Character.findAll()
    return res.toJSON()
  } catch (error) {
    throw new dbError(error.message)
  }
}

const createNewCharacter = async (newCharacter) => {
  try {
    const res = await Character.create(newCharacter)
    return res.toJSON()
  } catch (error) {
    throw new dbError(error.message)
  }
}

const updateCharacter = async (characterId, updatedCharacter) => {
  return 'Impelementar logica.'
}

const getOneCharacter = async (id) => {
  try {
    const res = await Character.findByPk(id)
    return res ? res.toJSON() : null
  } catch (error) {
    throw new dbError(error.message)
  }
}

export default {
  getAllCharacters,
  createNewCharacter,
  updateCharacter,
  getOneCharacter,
}
