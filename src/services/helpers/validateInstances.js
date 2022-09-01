const movieRepository = require('../../database/repository/movieRepository')
const characterRepository = require('../../database/repository/characterRepository')
const { DbError } = require('../../errors/errorsMessages')
const { MOVIEMODEL, CHARACTERMODEL } = require('../../utils/variables')

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

    return moviesInstance
  }

  if (model === CHARACTERMODEL) {
    let characterInstances = []
    for (const characterId of ids) {
      try {
        const characterIns = await characterRepository.getOneCharacter(
          characterId,
        )
        characterInstances.push(characterIns)
      } catch (error) {
        throw new DbError(error.message)
      }
    }

    return characterInstances
  }
}

module.exports = { validateInstances }
