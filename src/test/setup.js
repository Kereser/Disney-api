const { sequelize } = require('../database/database')
const { Movie } = require('../database/models/Movie')
const { Genre } = require('../database/models/Genre')

beforeAll(async () => {
  await sequelize.sync({ force: true })
})

beforeEach(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.drop()
  await sequelize.close()
})

global.createGenre = async (name, associatedMovies) => {
  const genre = await Genre.create({
    name,
    image: `${name}.jpg`,
  })

  for (const movieId of associatedMovies) {
    const movieInstance = await Movie.findByPk(movieId)
    await genre.addMovie(movieInstance)
  }

  return genre
}
