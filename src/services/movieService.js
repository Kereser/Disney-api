const movieRepository = require('../database/respository/movieRepository')
const { MOVIEMODEL } = require('../utils/variables')
const { alreayInDb } = require('./helpers/alreayInDb')
const { validateId } = require('./helpers/validateId')

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
