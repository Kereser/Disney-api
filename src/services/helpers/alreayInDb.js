const { MOVIEMODEL, CHARACTERMODEL } = require('../../utils/variables')
const movieRepository = require('../../database/repository/movieRepository')
const characterRepository = require('../../database/repository/characterRepository')
const { BadRequestError } = require('../../errors/errorsMessages')

const alreayInDb = async (model, instanceToCheck) => {
  if (model === MOVIEMODEL) {
    try {
      const movieAlreadyInDb = await movieRepository.getMovieByTitle(
        instanceToCheck.title,
      )
      if (movieAlreadyInDb) {
        throw new BadRequestError('Movie already in db')
      }
      return movieAlreadyInDb
    } catch (error) {
      throw error
    }
  }

  if (model === CHARACTERMODEL) {
    try {
      const characterAlreadyInDb =
        await characterRepository.getOneCharacterByName(instanceToCheck.name)
      if (characterAlreadyInDb) {
        throw new BadRequestError('Character already in db')
      }
      return characterAlreadyInDb
    } catch (error) {
      throw error
    }
  }
}

module.exports = { alreayInDb }
