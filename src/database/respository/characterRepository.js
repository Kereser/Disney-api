import { Character } from '../models/Character.js'

const getAllCharacters = async () => {
  const res = await Character.findAll()
  return res
}

const createNewCharacter = async (newCharacter) => {
  const res = await Character.create(newCharacter)
  return res.toJSON()
}

const updateCharacterMovie = async () => {
  return 'Impelementar logica.'
}

export default {
  getAllCharacters,
  createNewCharacter,
  updateCharacterMovie,
}
