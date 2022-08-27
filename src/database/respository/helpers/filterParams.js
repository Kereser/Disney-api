const { MOVIEMODEL } = require('../../../utils/variables')
const { Movie } = require('../../models/Movie')
const { Op } = require('sequelize')
const { DbError } = require('../../../errors/errorsMessages')

const constructFilters = (params, query) => {
  let filterArr = []
  for (const param of params) {
    if (param === 'title') {
      filterArr.push({ [param]: { [Op.iLike]: `%${query[param]}%` } })
    }
    //! Falta construir id de genre para filtrar por esto.
  }
  return filterArr.length > 1 ? filterArr : filterArr[0]
}

const filterParams = async (model, params, query) => {
  let movieRes
  if (model === MOVIEMODEL) {
    const filters = constructFilters(params, query)

    if (filters instanceof Object) {
      try {
        movieRes = await Movie.findAll({
          where: filters,
        })
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

    try {
      movieRes = await Movie.findAll()
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
    // movieRes = Movie.findAll({
    //   where: {[Op.and] : filters}
    // })
  }
}

module.exports = {
  filterParams,
}
