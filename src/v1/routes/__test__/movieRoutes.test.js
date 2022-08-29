const supertest = require('supertest')
const { app } = require('../../../app.js')
const Utils = require('../../../utils/variables')
const { v4: uuidv4 } = require('uuid')

const api = supertest(app)

describe('Empy db', () => {
  describe('Creting user', () => {
    it('Cannot create movie if characterId not found --- return 404', async () => {
      const notFoundId = uuidv4()

      const movieWithCharacter = { ...Utils.NEWMOVIE }
      movieWithCharacter.characters = [notFoundId]
      const movie = await api.post('/api/v1/movies').send(movieWithCharacter)

      expect(movie.statusCode).toBe(404)
      expect(movie.body.errors[0].message).toBe('Character not found')
    })

    it('Can create a movie with basic fields --- return 201', async () => {
      const res = await api.post('/api/v1/movies').send(Utils.NEWMOVIE)

      const recievedCreationDate = new Date(res.body.data.creationDate)
      expect(res.statusCode).toBe(201)
      expect(recievedCreationDate).toEqual(
        new Date(Utils.NEWMOVIE.creationDate),
      )
      expect(res.body.data.calification).toBe(Utils.NEWMOVIE.calification)
      expect(res.body.data.title).toBe(Utils.NEWMOVIE.title)
    })

    it('Can create a movie with associated characters --- return 201', async () => {
      const character = await api
        .post('/api/v1/characters')
        .send(Utils.NEWCHARACTER)
      expect(character.statusCode).toBe(201)

      const movieWithCharacter = { ...Utils.NEWMOVIE }
      movieWithCharacter.characters = [character.body.data.id]
      const movie = await api.post('/api/v1/movies').send(movieWithCharacter)

      expect(movie.statusCode).toBe(201)
      expect(movie.body.data.Characters).toHaveLength(1)
      expect(movie.body.data.Characters[0].name).toBe(Utils.NEWCHARACTER.name)
    })
  })

  describe('Getting one movie', () => {
    it('Cannot get one movie if malformatted id --- return 400', async () => {
      const res = await api.get('/api/v1/movies/gjsdfl;kgs')

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('movieId must be a valid id')
    })
  })

  describe('Deleteing movie', () => {
    it('Cannot delete movie if malformatted id --- return 400', async () => {
      const res = await api.delete('/api/v1/movies/ldkagjh;;aisg')

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('movieId must be a valid id')
    })
  })

  describe('Updating one movie', () => {
    it('Cannot update movie if malformatted id --- return 400', async () => {
      const res = await api
        .put('/api/v1/movies/ldkagjh;;aisg')
        .send(Utils.NEWMOVIE2)

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('movieId must be a valid id')
    })
  })
})

describe('require movies in db', () => {
  let character1
  let character2
  let character3
  let movieWithCharacter1
  let movieWithCharacter2
  let movieWithCharacter3
  beforeEach(async () => {
    character1 = await api.post('/api/v1/characters').send(Utils.NEWCHARACTER)
    character2 = await api.post('/api/v1/characters').send(Utils.NEWCHARACTER2)
    character3 = await api.post('/api/v1/characters').send(Utils.NEWCHARACTER3)

    //*Creating movies with characters
    const movieCharacter = { ...Utils.NEWMOVIE }
    movieCharacter.characters = [character1.body.data.id]
    movieWithCharacter1 = await api.post('/api/v1/movies').send(movieCharacter)

    const movieCharacter2 = { ...Utils.NEWMOVIE2 }
    movieCharacter2.characters = [
      character1.body.data.id,
      character2.body.data.id,
    ]
    movieWithCharacter2 = await api.post('/api/v1/movies').send(movieCharacter2)

    const movieCharacter3 = { ...Utils.NEWMOVIE3 }
    movieCharacter3.characters = [
      character1.body.data.id,
      character2.body.data.id,
      character3.body.data.id,
    ]
    movieWithCharacter3 = await api.post('/api/v1/movies').send(movieCharacter3)
  })

  describe('Creating movies', () => {
    it('Cannot create a movie with existing title in db --- return 400', async () => {
      const res2 = await api.post('/api/v1/movies').send(Utils.NEWMOVIE)
      expect(res2.statusCode).toBe(400)
      expect(res2.body.errors[0].message).toBe('Movie already in db')
    })
  })

  describe('Getting movies', () => {
    describe('Getting all movies', () => {
      it('Return all movies with title, image, creationDate and id --- return 200', async () => {
        const res = await api.get('/api/v1/movies')

        expect(res.statusCode).toBe(200)
        expect(res.body.data).toHaveLength(3)
        expect(res.body.data[0].title).toBe(movieWithCharacter1.body.data.title)
        expect(res.body.data[0].id).toBeDefined()
        expect(res.body.data[0].calification).not.toBeDefined()
      })

      it('Can filter by title --- return 200', async () => {
        const res = await api.get(`/api/v1/movies?title=el padrino`)

        expect(res.statusCode).toBe(200)
        expect(res.body.data).toHaveLength(2)
      })

      it('Can get the movies in ASC order --- return 200', async () => {
        const res = await api.get(`/api/v1/movies?order=ASC`)

        expect(res.statusCode).toBe(200)
        expect(res.body.data).toHaveLength(3)
        expect(res.body.data[0].title).toBe(movieWithCharacter2.body.data.title)
        expect(res.body.data[1].title).toBe(movieWithCharacter3.body.data.title)
        expect(res.body.data[2].title).toBe(movieWithCharacter1.body.data.title)
      })

      it('Filter by title and DESC order --- return 200', async () => {
        const res = await api.get(`/api/v1/movies?order=DESC&title=el pa`)

        expect(res.statusCode).toBe(200)
        expect(res.body.data).toHaveLength(2)
        expect(res.body.data[0].title).toBe(movieWithCharacter3.body.data.title)
        expect(res.body.data[1].title).toBe(movieWithCharacter2.body.data.title)
      })
    })

    describe('Getting one movie', () => {
      it('Cannot get one movie if not in db --- return 404', async () => {
        const id = uuidv4()
        const res = await api.get(`/api/v1/movies/${id}`)

        expect(res.statusCode).toBe(404)
        expect(res.body.errors[0].message).not.toBe('Route not found')
        expect(res.body.errors[0].message).toBe('Movie not found')
      })

      it('Can get one movie if correct id was provied --- return 200', async () => {
        const { id } = movieWithCharacter1.body.data

        const res = await api.get(`/api/v1/movies/${id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data.title).toBe(Utils.NEWMOVIE.title)
        expect(res.body.data.image).toBe(Utils.NEWMOVIE.image)
        expect(res.body.data.calification).toBeDefined()
      })

      it('Can get the associated characters with the movie --- return 200', async () => {
        const { id } = movieWithCharacter1.body.data

        const res = await api.get(`/api/v1/movies/${id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data.title).toBe(Utils.NEWMOVIE.title)
        expect(res.body.data.Characters[0].name).toBe(Utils.NEWCHARACTER.name)
      })
    })
  })

  describe('Deleting movies', () => {
    it('Cannot delete movie if not found --- return 404', async () => {
      const id = uuidv4()
      const res = await api.delete(`/api/v1/movies/${id}`)

      expect(res.statusCode).toBe(404)
      expect(res.body.errors[0].message).toBe('Movie not found')
    })

    it('Can delete movie if correct id was provided', async () => {
      const { id } = movieWithCharacter1.body.data
      const res = await api.delete(`/api/v1/movies/${id}`)

      expect(res.statusCode).toBe(204)
    })
  })

  describe('Updating movies', () => {
    it('Cannot update movie if not found --- return 404', async () => {
      const id = uuidv4()
      const res = await api.put(`/api/v1/movies/${id}`)

      expect(res.statusCode).toBe(404)
      expect(res.body.errors[0].message).toBe('Movie not found')
    })

    it('Can update movie with simple fields without changing associated characters --- return 200', async () => {
      const { id } = movieWithCharacter1.body.data
      const res = await api.put(`/api/v1/movies/${id}`).send(Utils.NEWMOVIE2)

      expect(res.statusCode).toBe(200)
      expect(res.body.data.title).not.toBe(Utils.NEWMOVIE.title)
      expect(res.body.data.title).toBe(Utils.NEWMOVIE2.title)
      expect(res.body.data.calification).not.toBe(Utils.NEWMOVIE.calification)
      expect(res.body.data.calification).toBe(Utils.NEWMOVIE2.calification)
      expect(res.body.data.Characters[0].name).toBe(Utils.NEWCHARACTER.name)
    })

    it('Cannot update movie if malfformatted characterId --- return 400', async () => {
      const { id } = movieWithCharacter3.body.data

      const updatedMovie = {
        title: 'New title',
        calification: 3,
        characters: [
          character1.body.data.id,
          character2.body.data.id,
          'kgj;askljgklasru;las',
        ],
      }
      const res = await api.put(`/api/v1/movies/${id}`).send(updatedMovie)

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('characterId must be a valid id')
    })

    it('Cannot update movie if characterId not found --- return 404', async () => {
      const { id } = movieWithCharacter3.body.data
      const notFoundId = uuidv4()

      const updatedMovie = {
        title: 'New title',
        calification: 3,
        characters: [
          character1.body.data.id,
          character2.body.data.id,
          notFoundId,
        ],
      }
      const res = await api.put(`/api/v1/movies/${id}`).send(updatedMovie)

      expect(res.statusCode).toBe(404)
      expect(res.body.errors[0].message).toBe('Character not found')
    })

    it('Can update associated characters field --- return 200', async () => {
      const { id } = movieWithCharacter1.body.data

      const updatedMovie = {
        title: 'New title',
        calification: 3,
        characters: [
          character1.body.data.id,
          character2.body.data.id,
          character3.body.data.id,
        ],
      }
      const res = await api.put(`/api/v1/movies/${id}`).send(updatedMovie)

      expect(res.statusCode).toBe(200)
      expect(res.body.data.Characters).toHaveLength(3)
      expect(res.body.data.title).toBe(updatedMovie.title)
      const names = res.body.data.Characters.map((ch) => ch.name.toLowerCase())
      expect(names).toContain(Utils.NEWCHARACTER.name.toLowerCase())
      expect(names).toContain(Utils.NEWCHARACTER2.name.toLowerCase())
      expect(names).toContain(Utils.NEWCHARACTER3.name.toLowerCase())
    })
  })
})
