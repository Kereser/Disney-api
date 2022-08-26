const { DbError } = require('../../errors/errorsMessages')
const { Character } = require('../models/Character')

const getAllCharacters = async () => {
  try {
    const res = await Character.findAll()
    return res.length > 0 ? res : []
  } catch (error) {
    throw new DbError(error.message)
  }
}

const createNewCharacter = async (newCharacter) => {
  try {
    const res = await Character.create(newCharacter)
    return res
  } catch (error) {
    throw new DbError(error.message)
  }
}

const updateCharacter = async (characterId, fieldToUpdate) => {
  const characterToUpdate = await Character.findByPk(characterId)

  characterToUpdate.set(fieldToUpdate)
  return await characterToUpdate.save()
}

const getOneCharacter = async (id) => {
  try {
    const res = await Character.findByPk(id)
    return res ? res : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const getOneCharacterByName = async (characterName) => {
  try {
    const res = await Character.findOne({ where: { name: characterName } })
    return res ? res : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const deleteCharacter = async (characterId) => {
  try {
    await Character.destroy({ where: { id: characterId } })
  } catch (error) {
    throw new DbError(error.message)
  }
}

module.exports = {
  getAllCharacters,
  createNewCharacter,
  updateCharacter,
  getOneCharacter,
  getOneCharacterByName,
  deleteCharacter,
}
