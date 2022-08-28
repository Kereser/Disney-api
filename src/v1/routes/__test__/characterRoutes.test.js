const supertest = require('supertest')
const { app } = require('../../../app.js')
const Utils = require('../../../utils/variables')
const { v4: uuidv4 } = require('uuid')

const api = supertest(app)

describe('Not require characters in db', () => {
  describe('Creating a character', () => {
    it('Can create new Character with simple fields --- return 201', async () => {
      const res = await api.post('/api/v1/characters').send(Utils.NEWCHARACTER)
      expect(res.statusCode).toBe(201)
      expect(res.body.data.name).toEqual(Utils.NEWCHARACTER.name)
      expect(res.body.data.weight).toEqual(Utils.NEWCHARACTER.weight)
    })

    it('Cannot create characters with the same name --- return 400', async () => {
      const res = await api.post('/api/v1/characters').send(Utils.NEWCHARACTER)
      expect(res.statusCode).toBe(201)
      expect(res.body.data.name).toEqual(Utils.NEWCHARACTER.name)
      expect(res.body.data.weight).toEqual(Utils.NEWCHARACTER.weight)

      const res2 = await api.post('/api/v1/characters').send(Utils.NEWCHARACTER)

      expect(res2.statusCode).toBe(400)
      expect(res2.body.errors[0].message).toBe('Character already in db')
    })

    it('Can create character with associated movies --- return 201', async () => {
      const movie = await api.post('/api/v1/movies').send(Utils.NEWMOVIE)

      expect(movie.statusCode).toBe(201)
      expect(movie.body.data.title).toBe(Utils.NEWMOVIE.title)

      const newCharacterWithMovie = { ...Utils.NEWCHARACTER }
      newCharacterWithMovie.movies = [movie.body.data.id]

      const character = await api
        .post('/api/v1/characters')
        .send(newCharacterWithMovie)

      expect(character.statusCode).toBe(201)
      expect(character.body.data.Movies[0].title).toBe(Utils.NEWMOVIE.title)
      expect(character.body.data.Movies).toHaveLength(1)
    })

    it('Cannot create character if movieIds are not valid --- return 400', async () => {
      const newCharacterWithMovie = { ...Utils.NEWCHARACTER }
      newCharacterWithMovie.movies = ['jg;kjsakl;g325=ksagjisag;']

      const character = await api
        .post('/api/v1/characters')
        .send(newCharacterWithMovie)

      expect(character.statusCode).toBe(400)
      expect(character.body.errors[0].message).toBe(
        'movieId must be a valid id',
      )
    })

    it('Cannot create character if one or more movieIds are not found --- return 404', async () => {
      const movieId = uuidv4()
      const newCharacterWithMovie = { ...Utils.NEWCHARACTER }
      newCharacterWithMovie.movies = [movieId]

      const character = await api
        .post('/api/v1/characters')
        .send(newCharacterWithMovie)

      expect(character.statusCode).toBe(404)
      expect(character.body.errors[0].message).toBe('Movie not found')
    })
  })

  describe('Getting one character', () => {
    it('Cannot get the character if malformatted id --- return 400', async () => {
      const resCharacter = await api.get(
        `/api/v1/characters/2905230958skgjskld`,
      )
      expect(resCharacter.statusCode).toBe(400)
      expect(resCharacter.body.errors[0].message).toBe(
        'characterId must be a valid id',
      )
    })
  })

  describe('Deleting one character', () => {
    it('Cannot delete a character with malformatted id -- return 400', async () => {
      const res = await api.delete(`/api/v1/characters/2905230958skgjskld`)

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('characterId must be a valid id')
    })
  })

  describe('Updating one character', () => {
    it('Cannot update if malformatted id --- return 400', async () => {
      const res = await api.put('/api/v1/characters/823765fkdgj;lskd')

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('characterId must be a valid id')
    })
  })
})

describe('Require characters already in db', () => {
  let characterWithMovie
  let characterWithMovie2
  let movie1
  let movie2
  let movie3
  beforeEach(async () => {
    movie1 = await api.post('/api/v1/movies').send(Utils.NEWMOVIE)
    movie2 = await api.post('/api/v1/movies').send(Utils.NEWMOVIE2)
    movie3 = await api.post('/api/v1/movies').send(Utils.NEWMOVIE3)

    const characterMovie = { ...Utils.NEWCHARACTER }
    characterMovie.movies = [movie1.body.data.id, movie2.body.data.id]
    characterWithMovie = await api
      .post('/api/v1/characters')
      .send(characterMovie)

    const characterMovie2 = { ...Utils.NEWCHARACTER2 }
    characterMovie.movies = [movie3.body.data.id]
    characterWithMovie2 = await api
      .post('/api/v1/characters')
      .send(characterMovie2)
  })

  describe('Getting all movies', () => {
    it('Can get all character as an array with only name, image and id --- return 200', async () => {
      const res = await api.get('/api/v1/characters')

      expect(res.statusCode).toBe(200)
      expect(res.body.data).toHaveLength(2)
      expect(res.body.data[0].name).toEqual(characterWithMovie.body.data.name)
      expect(res.body.data[0].id).toBeDefined()
      expect(res.body.data[0].weight).toBe(undefined)
    })
  })

  describe('Getting one movie', () => {
    it('Can get one character by id with associated movies --- return 200', async () => {
      const { id } = characterWithMovie.body.data
      const resCharacter = await api.get(`/api/v1/characters/${id}`)

      expect(resCharacter.statusCode).toBe(200)
      expect(resCharacter.body.data.name).toBe(
        characterWithMovie.body.data.name,
      )
      expect(resCharacter.body.data.image).toBe(
        characterWithMovie.body.data.image,
      )
      expect(resCharacter.body.data.Movies[0].title).toBe(Utils.NEWMOVIE.title)
      expect(resCharacter.body.data.Movies).toHaveLength(2)
    })

    it('Cannot get the character if not found --- return 404', async () => {
      const id = uuidv4()
      const resCharacter = await api.get(`/api/v1/characters/${id}`)

      expect(resCharacter.statusCode).toBe(404)
      expect(resCharacter.body.errors[0].message).toBe('Character not found')
    })
  })

  describe('Deleting a character', () => {
    it('Cannot delete a character if not found/with correct id --- return 404', async () => {
      const id = uuidv4()
      const res = await api.delete(`/api/v1/characters/${id}`)

      expect(res.statusCode).toBe(404)
      expect(res.body.errors[0].message).toBeDefined()
      expect(res.body.errors[0].message).not.toBe('Route not found')
      expect(res.body.errors[0].message).toBe('Character not found')
    })

    it('Can delete a character with validId --- return 204', async () => {
      const { id } = characterWithMovie2.body.data
      const res = await api.delete(`/api/v1/characters/${id}`)
      expect(res.statusCode).toBe(204)

      const allCharacters = await api.get('/api/v1/characters')
      expect(allCharacters.statusCode).toBe(200)
      expect(allCharacters.body.data).toHaveLength(1)
      expect(allCharacters.body.data[0].name).toBe(Utils.NEWCHARACTER.name)
    })
  })

  describe('Updating user', () => {
    it('Cannot update if character not found --- return 404', async () => {
      const id = uuidv4()

      const res = await api.put(`/api/v1/characters/${id}`)
      expect(res.statusCode).toBe(404)
      expect(res.body.errors[0].message).toBe('Character not found')
    })

    it('Can update a user in simple fields without changing movies --- return 200', async () => {
      const { id } = characterWithMovie.body.data

      const newCharacter = {
        name: 'Pepito moreno',
        age: 34,
      }
      const res = await api.put(`/api/v1/characters/${id}`).send(newCharacter)

      expect(res.statusCode).toBe(200)
      expect(res.body.data.name).toBe(newCharacter.name)
      expect(res.body.data.age).toBe(34)
      expect(res.body.data.image).toBe(characterWithMovie.body.data.image)
      expect(res.body.data.Movies[0].title).toBe(Utils.NEWMOVIE.title)
      expect(res.body.data.Movies).toHaveLength(2)
    })

    it('Can update movies field --- return 200', async () => {
      const { id } = characterWithMovie2.body.data

      const newCharacter = {
        name: 'Pepito moreno',
        age: 34,
        movies: [movie1.body.data.id, movie2.body.data.id, movie3.body.data.id],
      }

      const res = await api.put(`/api/v1/characters/${id}`).send(newCharacter)
      expect(res.body.data.Movies).toHaveLength(3)
    })

    it('Cannot update if one or more movieIds are not valid --- return 400', async () => {
      const { id } = characterWithMovie2.body.data

      const newCharacter = {
        name: 'Pepito moreno',
        age: 34,
        movies: [movie1.body.data.id, 'jksjg23-2525sdg-23523'],
      }

      const res = await api.put(`/api/v1/characters/${id}`).send(newCharacter)
      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('movieId must be a valid id')
    })

    it('Cannot update if one or more movieIds are not found --- return 404', async () => {
      const { id } = characterWithMovie2.body.data
      const movieId = uuidv4()

      const newCharacter = {
        name: 'Pepito moreno',
        age: 34,
        movies: [movieId],
      }

      const res = await api.put(`/api/v1/characters/${id}`).send(newCharacter)
      expect(res.statusCode).toBe(404)
      expect(res.body.errors[0].message).toBe('Movie not found')
    })
  })
})
