const characterRepository = require('../database/respository/characterRepository')
const { BadRequestError } = require('../errors/errorsMessages')
const { validateIds } = require('../utils/validateIds')
const { MOVIEMODEL } = require('../utils/variables')

const getAllCharacters = async () => {
  try {
    return await characterRepository.getAllCharacters()
  } catch (error) {
    throw error
  }
}

const getOneCharacter = async (characterId) => {
  try {
    const character = await characterRepository.getOneCharacter(characterId)
    if (!character) {
      throw new BadRequestError('Not character found')
    }
    return character
  } catch (error) {
    throw error
  }
}

const createNewCharacter = async (newCharacter) => {
  if (newCharacter.movies) {
    let moviesInstance
    try {
      moviesInstance = await validateIds(newCharacter.movies, MOVIEMODEL)
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

const updateCharacter = async (characterId, updatedCharacter) => {
  //! Extraer esta parte a validateCharacter.js
  //**
  let character
  try {
    // look if the characterId is on correct format
    character = await characterRepository.getOneCharacter(characterId)
    if (!character) {
      throw new BadRequestError('Not character found')
    }
  } catch (error) {
    throw error
  }

  if (updateCharacter.movies) {
    let moviesInstance
    try {
      moviesInstance = await validateIds(newCharacter.movies, MOVIEMODEL)
    } catch (error) {
      throw error
    }

    try {
      //* Crear tablas para poder comprobar el comportamiento.
      //* Probar dos opcione:
      //! Primera -> borrar todas las movies y pasar el objeto que me llego del user para actualizarlo. Luego, anadir las nuevas movies que habian llegado con el updatedCharacter
      //! Segunda -> Otra opcion es porbar con el set. Tengo que mirar como es el tema de la actualizacion en ese sentido..
      const res = await characterRepository.updateCharacter(
        characterId,
        updatedCharacter,
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
      updatedCharacter,
    )
    return res
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  getAllCharacters,
  createNewCharacter,
  updateCharacter,
  getOneCharacter,
}
