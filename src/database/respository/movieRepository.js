const { DbError } = require('../../errors/errorsMessages')
const { Movie } = require('../models/Movie')
const { filterParams } = require('./helpers/filterParams')
const { MOVIEMODEL } = require('../../utils/variables')
const { Character } = require('../models/Character')

const getAllMovies = async (query) => {
  const params = Object.keys(query)
  let movieRes
  if (params.length === 0) {
    try {
      movieRes = await Movie.findAll()
      return movieRes
    } catch (error) {
      throw new DbError(error.message)
    }
  }

  try {
    const movieRes = await filterParams(MOVIEMODEL, params, query)
    return movieRes
  } catch (error) {
    throw error
  }
}

const getMovieByTitle = async (movieTitle) => {
  try {
    const res = await Movie.findOne({
      where: { title: movieTitle },
      include: Character,
    })
    return res ? res : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const getOneMovie = async (id) => {
  try {
    const movie = await Movie.findByPk(id, { include: Character })
    return movie ? movie : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const createNewMovie = async (newMovie, characterInstances) => {
  try {
    const createdMovie = await Movie.create(newMovie)
    if (characterInstances) {
      await createdMovie.addCharacters(characterInstances)
    }
    return createdMovie
  } catch (error) {
    throw new DbError(error.message)
  }
}

const updateOneMovie = async (movieId, fieldToUpdate, characterInstances) => {
  try {
    const movie = await Movie.findByPk(movieId, { include: Character })
    if (characterInstances) {
      delete fieldToUpdate.characters
      fieldToUpdate.Characters = characterInstances
      movie.set(fieldToUpdate)
      return await movie.save()
    }
    movie.set(fieldToUpdate)
    return await movie.save()
  } catch (error) {
    throw new DbError(error.message)
  }
}

const deleteOneMovie = async (movieId) => {
  try {
    await Movie.destroy({ where: { id: movieId } })
  } catch (error) {
    throw new DbError(error.message)
  }
}

module.exports = {
  getOneMovie,
  createNewMovie,
  getAllMovies,
  getMovieByTitle,
  updateOneMovie,
  deleteOneMovie,
}
