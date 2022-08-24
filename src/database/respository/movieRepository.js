const { Movie } = require('../models/Movie')

const getOneMovie = async (id) => {
  const movie = await Movie.findByPk(id)
  return movie ? movie.toJSON() : null
}

const createNewMovie = async (newMovie) => {
  //!trycatch
  const movie = await Movie.create(newMovie)
  return movie
}

module.exports = {
  getOneMovie,
  createNewMovie,
}
