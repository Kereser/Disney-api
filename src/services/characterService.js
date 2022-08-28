const characterRepository = require('../database/respository/characterRepository')
const { BadRequestError } = require('../errors/errorsMessages')
const { validateId } = require('./helpers/validateId')
const { validateInstances } = require('./helpers/validateInstances')
const { MOVIEMODEL } = require('../utils/variables')
const { CHARACTERMODEL } = require('../utils/variables')
const { alreayInDb } = require('./helpers/alreayInDb')

//! Limitar la cantidad de recursos q envio por query params.
const getAllCharacters = async () => {
  try {
    const allCharacters = await characterRepository.getAllCharacters()
    return allCharacters.length > 0
      ? allCharacters.map((character) => {
          return {
            id: character.id,
            name: character.name,
            image: character.image,
          }
        })
      : allCharacters
  } catch (error) {
    throw error
  }
}

const getOneCharacter = async (characterId) => {
  try {
    const character = await validateId(CHARACTERMODEL, characterId)
    return character
  } catch (error) {
    throw error
  }
}

const createNewCharacter = async (newCharacter) => {
  try {
    await alreayInDb(CHARACTERMODEL, newCharacter)
  } catch (error) {
    throw error
  }

  if (newCharacter.movies) {
    let moviesInstance
    try {
      for (const movieId of newCharacter.movies) {
        await validateId(MOVIEMODEL, movieId)
      }
      moviesInstance = await validateInstances(MOVIEMODEL, newCharacter.movies)
    } catch (error) {
      throw error
    }

    try {
      const res = await characterRepository.createNewCharacter(
        newCharacter,
        moviesInstance,
      )
      return await characterRepository.getOneCharacter(res.id)
    } catch (error) {
      throw error
    }
  }

  try {
    delete newCharacter.movies
    const res = await characterRepository.createNewCharacter(newCharacter)
    return res
  } catch (error) {
    throw error
  }
}

const updateCharacter = async (characterId, fieldToUpdate) => {
  //**
  try {
    await validateId(CHARACTERMODEL, characterId)
  } catch (error) {
    throw error
  }

  if (fieldToUpdate.movies) {
    let moviesInstance
    try {
      for (const movieId of fieldToUpdate.movies) {
        await validateId(MOVIEMODEL, movieId)
      }
      moviesInstance = await validateInstances(MOVIEMODEL, fieldToUpdate.movies)
    } catch (error) {
      throw error
    }

    try {
      const res = await characterRepository.updateCharacter(
        characterId,
        fieldToUpdate,
        moviesInstance,
      )
      return res
    } catch (error) {
      throw error
    }
  }

  try {
    const res = await characterRepository.updateCharacter(
      characterId,
      fieldToUpdate,
    )
    return res
  } catch (error) {
    console.error(error)
  }
}

const deleteCharacter = async (characterId) => {
  try {
    await validateId(CHARACTERMODEL, characterId)
    await characterRepository.deleteCharacter(characterId)
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAllCharacters,
  createNewCharacter,
  updateCharacter,
  getOneCharacter,
  deleteCharacter,
}
