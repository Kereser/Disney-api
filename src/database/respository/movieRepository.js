const { DbError } = require('../../errors/errorsMessages')
const { Movie } = require('../models/Movie')

const getAllMovies = async () => {
  try {
    const res = await Movie.findAll()
    return res.length > 0 ? res : []
  } catch (error) {
    throw new DbError(error.message)
  }
}

const getOneMovie = async (id) => {
  const movie = await Movie.findByPk(id)
  return movie ? movie : null
}

const getMovieByTitle = async (movieTitle) => {
  try {
    const res = await Movie.findOne({ where: { title: movieTitle } })
    return res ? res : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const createNewMovie = async (newMovie) => {
  try {
    const movie = await Movie.create(newMovie)
    return movie
  } catch (error) {
    throw new DbError(error.message)
  }
}

module.exports = {
  getOneMovie,
  createNewMovie,
  getAllMovies,
  getMovieByTitle,
}
