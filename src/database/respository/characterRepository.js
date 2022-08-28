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

const createNewCharacter = async (newCharacter, moviesInstance) => {
  try {
    const res = await Character.create(newCharacter)
    if (moviesInstance) {
      for (const movieInstance of moviesInstance) {
        await res.addMovie(movieInstance)
      }
    }
    return res
  } catch (error) {
    throw new DbError(error.message)
  }
}

const updateCharacter = async (characterId, fieldsToUpdate, moviesInstance) => {
  try {
    const characterToUpdate = await Character.findByPk(characterId, {
      include: 'Movies',
    })

    if (fieldsToUpdate.movies) {
      fieldsToUpdate.Movies = moviesInstance
      characterToUpdate.set(fieldsToUpdate)
      return await characterToUpdate.save()
    }
    characterToUpdate.set(fieldsToUpdate)
    return await characterToUpdate.save()
  } catch (error) {
    throw new DbError(error.message)
  }
}

const getOneCharacter = async (id) => {
  try {
    const res = await Character.findByPk(id, { include: 'Movies' })
    return res ? res : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const getOneCharacterByName = async (characterName) => {
  try {
    const res = await Character.findOne({
      where: { name: characterName },
      include: 'Movies',
    })
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
