const { DbError } = require('../../errors/errorsMessages')
const { CHARACTERMODEL } = require('../../utils/variables')
const { Character } = require('../models/Character')
const { Movie } = require('../models/Movie')
const { filterParams } = require('./helpers/filterParams')

const getAllCharacters = async (queryParams) => {
  const params = Object.keys(queryParams)
  if (params.length === 0) {
    try {
      const res = await Character.findAll()
      return res.length > 0 ? res : []
    } catch (error) {
      throw new DbError(error.message)
    }
  }

  try {
    const characters = await filterParams(CHARACTERMODEL, params, queryParams)
    return characters
  } catch (error) {
    throw error
  }
}

const createNewCharacter = async (newCharacter, moviesInstance) => {
  try {
    const res = await Character.create(newCharacter)
    if (moviesInstance) {
      await res.addMovies(moviesInstance)
    }
    return res
  } catch (error) {
    throw new DbError(error.message)
  }
}

const updateCharacter = async (characterId, fieldsToUpdate, moviesInstance) => {
  try {
    const characterToUpdate = await Character.findByPk(characterId, {
      include: Movie,
    })

    if (moviesInstance) {
      delete fieldsToUpdate.movies
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
    const res = await Character.findByPk(id, { include: Movie })
    return res ? res : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const getOneCharacterByName = async (characterName) => {
  try {
    const res = await Character.findOne({
      where: { name: characterName },
      include: Movie,
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
