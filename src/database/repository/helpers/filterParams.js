const {
  MOVIEMODEL,
  CHARACTERMODEL,
  GENREMODEL,
} = require('../../../utils/variables')
const { Movie } = require('../../models/Movie')
const { Op } = require('sequelize')
const { DbError } = require('../../../errors/errorsMessages')
const { Character } = require('../../models/Character')
const { Genre } = require('../../models/Genre')
const { validateId } = require('../../../services/helpers/validateId')

const constructFilters = (params, query) => {
  let filterArr = []
  for (const param of params) {
    if (param === 'title') {
      filterArr.push({ [param]: { [Op.iLike]: `%${query[param]}%` } })
    }

    //* Parte para character
    if (param === 'name') {
      filterArr.push({ [param]: { [Op.iLike]: `%${query[param]}%` } })
    }
    if (param === 'age') {
      filterArr.push({ [param]: query[param] })
    }
    if (param === 'weight') {
      filterArr.push({ [param]: query[param] })
    }
  }
  return filterArr.length > 1
    ? { [Op.and]: filterArr }
    : filterArr.length === 1
    ? filterArr[0]
    : null
}

const filterParams = async (model, params, query) => {
  let movieRes
  if (model === MOVIEMODEL) {
    const filters = constructFilters(params, query)

    if (query.genre) {
      try {
        await validateId(GENREMODEL, query.genre)
      } catch (error) {
        throw error
      }
    }

    const objFilter = query.genre
      ? {
          where: filters,
          include: { model: Genre, where: { id: query.genre } },
        }
      : { where: filters }

    try {
      movieRes = await Movie.findAll(objFilter)
      if (query.order === 'ASC') {
        return movieRes.sort(function (a, b) {
          if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
          if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
          return 0
        })
      } else {
        return movieRes.sort(function (a, b) {
          if (a.title.toLowerCase() < b.title.toLowerCase()) return 1
          if (a.title.toLowerCase() > b.title.toLowerCase()) return -1
          return 0
        })
      }
    } catch (error) {
      throw new DbError(error.message)
    }
  }

  if (model === CHARACTERMODEL) {
    let characterRes
    const filters = constructFilters(params, query)

    if (query.movie) {
      try {
        await validateId(MOVIEMODEL, query.movie)
      } catch (error) {
        throw error
      }
    }

    const objFilter = query.movie
      ? {
          where: filters,
          include: { model: Movie, where: { id: query.movie } },
        }
      : { where: filters }

    try {
      characterRes = await Character.findAll(objFilter)
      return characterRes
    } catch (error) {
      throw new DbError(error.message)
    }
  }
}

module.exports = { filterParams }
