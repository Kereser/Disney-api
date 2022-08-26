const characterRepository = require('../database/respository/characterRepository')
const {
  BadRequestError,
  NotFoundError,
  DbError,
} = require('../errors/errorsMessages')
const { validateId } = require('./helpers/validateId')
const { validateInstances } = require('./helpers/validateInstances')
const { MOVIEMODEL } = require('../utils/variables')
const { CHARACTERMODEL } = require('../utils/variables')

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
    const characterAlreadyInDb =
      await characterRepository.getOneCharacterByName(newCharacter.name)
    if (characterAlreadyInDb) {
      throw new BadRequestError('Character already in db')
    }
  } catch (error) {
    throw error
  }

  if (newCharacter.movies) {
    let moviesInstance
    try {
      moviesInstance = await validateInstances(newCharacter.movies, MOVIEMODEL)
    } catch (error) {
      throw error
    }
    try {
      const res = await characterRepository.createNewCharacter(newCharacter)
      for (const movieInstance of moviesInstance) {
        res.addMovie(movieInstance)
      }
      return res
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
      moviesInstance = await validateInstances(newCharacter.movies, MOVIEMODEL)
    } catch (error) {
      throw error
    }

    try {
      //* Crear tablas para poder comprobar el comportamiento.
      //* Probar dos opcione:
      //! Primera -> borrar todas las movies y pasar el objeto que me llego del user para actualizarlo. Luego, anadir las nuevas movies que habian llegado con el fieldToUpdate
      //! Segunda -> Otra opcion es porbar con el set. Tengo que mirar como es el tema de la actualizacion en ese sentido..
      const res = await characterRepository.updateCharacter(
        characterId,
        fieldToUpdate,
      )
      for (const movieInstance of moviesInstance) {
        res.addMovie(movieInstance)
      }
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
