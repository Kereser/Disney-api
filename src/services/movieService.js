const movieRepository = require('../database/respository/movieRepository')
const { MOVIEMODEL } = require('../utils/variables')
const { alreayInDb } = require('./helpers/alreayInDb')

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

const getAllMovies = async () => {
  try {
    const responseMovies = await movieRepository.getAllMovies()
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

module.exports = { createNewMovie, getAllMovies }
