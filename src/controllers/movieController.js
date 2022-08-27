const movieService = require('../services/movieService')

//! IMPLEMENTAR DE UNA VEZ EL VALIDATION Y OTRO HELPER PARA PODER NORMALIZAR LOS DATOS QUE VAN A LA DB
const getAllMovies = async (req, res) => {
  const query = req.query
  try {
    const movies = await movieService.getAllMovies(query)
    res.status(200).send({ data: movies })
  } catch (error) {
    res.status(error.statusCode).send({ errors: error.errMsg() })
  }
}

const getOneMovie = async (req, res) => {
  const { movieId } = req.params
  try {
    const movie = await movieService.getOneMovie(movieId)
    res.status(200).send({ data: movie })
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

const updateOneMovie = async (req, res) => {
  const { movieId } = req.params
  const fieldToUpdate = { ...req.body }

  try {
    const movie = await movieService.updateOneMovie(movieId, fieldToUpdate)
    res.status(200).send({ data: movie })
  } catch (error) {
    res.status(error.statusCode).send({ errors: error.errMsg() })
  }
}

const deleteOneMovie = async (req, res) => {
  const { movieId } = req.params
  try {
    await movieService.deleteOneMovie(movieId)
    res.sendStatus(204)
  } catch (error) {
    res.status(error.statusCode).send({ errors: error.errMsg() })
  }
}

module.exports = {
  getAllMovies,
  createNewMovie,
  getOneMovie,
  updateOneMovie,
  deleteOneMovie,
}
