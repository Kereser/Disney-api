const movieRepository = require('../../database/respository/movieRepository')
const { BadRequestError, DbError } = require('../../errors/errorsMessages')
const { MOVIEMODEL } = require('../../utils/variables')

const validateInstances = async (model, ids) => {
  if (model === MOVIEMODEL) {
    let moviesInstance = []
    for (const movieId of ids) {
      try {
        const movie = await movieRepository.getOneMovie(movieId)
        moviesInstance.push(movie)
      } catch (error) {
        throw new DbError(error.message)
      }
    }

    if (moviesInstance.some((movIns) => movIns === null)) {
      throw new BadRequestError('Some movieIds are not in db')
    }

    return moviesInstance
  }
}

module.exports = { validateInstances }
