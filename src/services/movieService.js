const movieRepository = require('../database/respository/movieRepository')
const { MOVIEMODEL, CHARACTERMODEL } = require('../utils/variables')
const { alreayInDb } = require('./helpers/alreayInDb')
const { validateId } = require('./helpers/validateId')
const { validateInstances } = require('./helpers/validateInstances')

const getAllMovies = async (query) => {
  try {
    const responseMovies = await movieRepository.getAllMovies(query)
    return responseMovies.length > 0
      ? responseMovies.map((movie) => {
          return {
            image: movie.image,
            title: movie.title,
            creationDate: movie.creationDate,
            id: movie.id,
          }
        })
      : responseMovies
  } catch (error) {
    throw error
  }
}

const getOneMovie = async (movieId) => {
  try {
    await validateId(MOVIEMODEL, movieId)
    const movie = await movieRepository.getOneMovie(movieId)
    return movie
  } catch (error) {
    throw error
  }
}

const createNewMovie = async (newMovie) => {
  try {
    await alreayInDb(MOVIEMODEL, newMovie)
  } catch (error) {
    throw error
  }

  if (newMovie.characters) {
    let characterInstances = []
    try {
      for (const characterId of newMovie.characters) {
        await validateId(CHARACTERMODEL, characterId)
      }
      characterInstances = await validateInstances(
        CHARACTERMODEL,
        newMovie.characters,
      )
    } catch (error) {
      throw error
    }

    try {
      const movieRes = await movieRepository.createNewMovie(
        newMovie,
        characterInstances,
      )
      return await movieRepository.getOneMovie(movieRes.id)
    } catch (error) {
      throw error
    }
  }

  try {
    const responseMovie = await movieRepository.createNewMovie(newMovie)
    return responseMovie
  } catch (error) {
    throw error
  }
}

const updateOneMovie = async (movieId, fieldToUpdate) => {
  try {
    await validateId(MOVIEMODEL, movieId)
  } catch (error) {
    throw error
  }

  if (fieldToUpdate.characters) {
    let characterInstances
    try {
      for (const characterId of fieldToUpdate.characters) {
        await validateId(CHARACTERMODEL, characterId)
      }
      characterInstances = await validateInstances(
        CHARACTERMODEL,
        fieldToUpdate.characters,
      )
    } catch (error) {
      throw error
    }

    try {
      const movieRes = await movieRepository.updateOneMovie(
        movieId,
        fieldToUpdate,
        characterInstances,
      )
      return movieRes
    } catch (error) {
      throw error
    }
  }

  try {
    const movie = await movieRepository.updateOneMovie(movieId, fieldToUpdate)
    return movie
  } catch (error) {
    throw error
  }
}

const deleteOneMovie = async (movieId) => {
  try {
    await validateId(MOVIEMODEL, movieId)
    await movieRepository.deleteOneMovie(movieId)
  } catch (error) {
    throw error
  }
}

module.exports = {
  createNewMovie,
  getAllMovies,
  getOneMovie,
  updateOneMovie,
  deleteOneMovie,
}
