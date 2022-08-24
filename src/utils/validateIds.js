import movieRepository from '../database/respository/movieRepository.js'
import { BadRequestError } from '../errors/errorsMessages.js'
import { MOVIEMODEL } from './variables.js'

export const validateIds = async (ids, model) => {
  if (model === MOVIEMODEL) {
    let moviesInstance = []
    for (const movieId of ids) {
      try {
        const movie = await movieRepository.getOneMovie(movieId)
        moviesInstance.push(movie)
      } catch (error) {
        throw new BadRequestError('Malformatted id(s)')
      }
    }

    if (moviesInstance.some((movIns) => movIns === null)) {
      throw new BadRequestError('Some movieIds are not in db')
    }

    return moviesInstance
  }
}
