const movieService = require('../services/movieService')

const getAllMovies = async (req, res) => {
  try {
    const movies = await movieService.getAllMovies()
    res.status(200).send({ data: movies })
  } catch (error) {
    res.status(error.statusCode).send({ errors: error.errMsg() })
  }
}

const createNewMovie = async (req, res) => {
  const newMovie = req.body
  newMovie.creationDate = new Date(req.body.creationDate)

  try {
    const responseMovie = await movieService.createNewMovie(newMovie)
    res.status(201).send({ data: responseMovie })
  } catch (error) {
    res.status(error.statusCode).send({ errors: error.errMsg() })
  }
}

module.exports = {
  getAllMovies,
  createNewMovie,
}
