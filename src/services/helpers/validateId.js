const { CHARACTERMODEL } = require('../../utils/variables')
const { MOVIEMODEL } = require('../../utils/variables')
const characterRepository = require('../../database/respository/characterRepository')
const {
  BadRequestError,
  NotFoundError,
} = require('../../errors/errorsMessages')

/**
 * Functions that helps verify id and user within db.
 * @param {*} model
 * @param {*} id
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
      character = await characterRepository.getOneCharacter(id)
      if (!character) {
        throw new NotFoundError(CHARACTERMODEL)
      }
    } catch (error) {
      throw error
    }

    return character
  }
}

module.exports = { validateId }
