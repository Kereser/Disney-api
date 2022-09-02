const { DbError } = require('../../errors/errorsMessages')
const { CHARACTERMODEL } = require('../../utils/variables')
const { Character } = require('../models/Character')
const { Movie } = require('../models/Movie')
const { filterParams } = require('./helpers/filterParams')

/**
 *  @openapi
 *  components:
 *    schemas:
 *      Character:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *          name:
 *            type: string
 *            example: Bradd pitt
 *          image:
 *            type: string
 *            example: brad_pitt.jpg
 *          age:
 *            type: integer
 *            example: 50
 *          weight:
 *            type: double
 *            example: 170.2
 *          history:
 *            type: string
 *            example: Actor which...
 *          createdAt:
 *            type: string
 *            format: date
 *            pattern: ([0-9]{4})-([0-9]{2})-([0-9]{2}T[0-9]{2}):[0-9]{2}:[0-9]{2}.[0-9]{3}Z
 *            example: 2022-09-02T16:04:11.647Z
 *          updatedAt:
 *            type: string
 *            format: date
 *            pattern: ([0-9]{4})-([0-9]{2})-([0-9]{2}T[0-9]{2}):[0-9]{2}:[0-9]{2}.[0-9]{3}Z
 *            example: 2022-09-02T16:04:11.647Z
 *          Movies:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Movie'
 */

const getAllCharacters = async (queryParams) => {
  const params = Object.keys(queryParams)
  if (params.length === 0) {
    try {
      const res = await Character.findAll()
      return res.length > 0 ? res : []
    } catch (error) {
      throw new DbError(error.message)
    }
  }

  try {
    const characters = await filterParams(CHARACTERMODEL, params, queryParams)
    return characters
  } catch (error) {
    throw error
  }
}

const createNewCharacter = async (newCharacter, moviesInstance) => {
  try {
    const res = await Character.create(newCharacter)
    if (moviesInstance) {
      await res.addMovies(moviesInstance)
    }
    return res
  } catch (error) {
    throw new DbError(error.message)
  }
}

const updateCharacter = async (characterId, fieldsToUpdate, moviesInstance) => {
  try {
    const characterToUpdate = await Character.findByPk(characterId, {
      include: Movie,
    })

    if (moviesInstance) {
      delete fieldsToUpdate.movies
      fieldsToUpdate.Movies = moviesInstance
      characterToUpdate.set(fieldsToUpdate)
      return await characterToUpdate.save()
    }
    characterToUpdate.set(fieldsToUpdate)
    return await characterToUpdate.save()
  } catch (error) {
    throw new DbError(error.message)
  }
}

const getOneCharacter = async (id) => {
  try {
    const res = await Character.findByPk(id, { include: Movie })
    return res ? res : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const getOneCharacterByName = async (characterName) => {
  try {
    const res = await Character.findOne({
      where: { name: characterName },
      include: Movie,
    })
    return res ? res : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const deleteCharacter = async (characterId) => {
  try {
    await Character.destroy({ where: { id: characterId } })
  } catch (error) {
    throw new DbError(error.message)
  }
}

module.exports = {
  getAllCharacters,
  createNewCharacter,
  updateCharacter,
  getOneCharacter,
  getOneCharacterByName,
  deleteCharacter,
}
