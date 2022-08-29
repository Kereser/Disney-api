const {
  CHARACTERMODEL,
  MOVIEMODEL,
  GENREMODEL,
} = require('../../utils/variables')
const {
  BadRequestError,
  NotFoundError,
} = require('../../errors/errorsMessages')
const { Genre } = require('../../database/models/Genre')
const { Movie } = require('../../database/models/Movie')
const { Character } = require('../../database/models/Character')

/**
 * Functions that helps verify id and return instance of the model.
 * @param {String} model
 * @param {String} id
 * @returns Models.
 */
const validateId = async (model, id) => {
  if (model === CHARACTERMODEL) {
    const reg = /(\w{8}(-\w{4}){3}-\w{12}?)/
    if (!reg.test(id)) {
      throw new BadRequestError('characterId must be a valid id')
    }
    let character
    try {
      character = await Character.findByPk(id, { include: Movie })
      if (!character) {
        throw new NotFoundError(CHARACTERMODEL)
      }
    } catch (error) {
      throw error
    }

    return character
  }

  if (model === MOVIEMODEL) {
    const reg = /(\w{8}(-\w{4}){3}-\w{12}?)/
    if (!reg.test(id)) {
      throw new BadRequestError('movieId must be a valid id')
    }
    let movie
    try {
      character = await Movie.findByPk(id, { include: Character })
      if (!character) {
        throw new NotFoundError(MOVIEMODEL)
      }
    } catch (error) {
      throw error
    }

    return movie
  }

  if (model === GENREMODEL) {
    const reg = /(\w{8}(-\w{4}){3}-\w{12}?)/
    if (!reg.test(id)) {
      throw new BadRequestError('genreId must be a valid id')
    }
    let genre
    try {
      genre = await Genre.findByPk(id)
      if (!genre) {
        throw new NotFoundError(GENREMODEL)
      }
    } catch (error) {
      throw error
    }

    return genre
  }
}

module.exports = { validateId }
