const supertest = require('supertest')
const { app } = require('../../../app.js')
const movieUtil = require('../../../utils/variables')
const { v4: uuidv4 } = require('uuid')

const api = supertest(app)

describe('Empy db', () => {
  it('Can create a movie with basic fields --- return 201', async () => {
    const res = await api.post('/api/v1/movies').send(movieUtil.NEWMOVIE)

    const recievedCreationDate = new Date(res.body.data.creationDate)
    expect(res.statusCode).toBe(201)
    expect(recievedCreationDate).toEqual(
      new Date(movieUtil.NEWMOVIE.creationDate),
    )
    expect(res.body.data.calification).toBe(movieUtil.NEWMOVIE.calification)
    expect(res.body.data.title).toBe(movieUtil.NEWMOVIE.title)
  })

  it('Can create a movie with associated characters --- return 201', async () => {})

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
        .send(movieUtil.NEWMOVIE2)

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('movieId must be a valid id')
    })
  })
})

describe('require movies in db', () => {
  let movie1
  let movie2
  let movie3
  beforeEach(async () => {
    movie1 = await api.post('/api/v1/movies').send(movieUtil.NEWMOVIE)
    movie2 = await api.post('/api/v1/movies').send(movieUtil.NEWMOVIE2)
    movie3 = await api.post('/api/v1/movies').send(movieUtil.NEWMOVIE3)
  })

  describe('Creating movies', () => {
    it('Cannot create a movie with existing title in db --- return 400', async () => {
      const res2 = await api.post('/api/v1/movies').send(movieUtil.NEWMOVIE)
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
        expect(res.body.data[0].title).toBe(movie1.body.data.title)
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
        expect(res.body.data[0].title).toBe(movie2.body.data.title)
        expect(res.body.data[1].title).toBe(movie3.body.data.title)
        expect(res.body.data[2].title).toBe(movie1.body.data.title)
      })

      it('Filter by title and DESC order --- return 200', async () => {
        const res = await api.get(`/api/v1/movies?order=DESC&title=el pa`)

        expect(res.statusCode).toBe(200)
        expect(res.body.data).toHaveLength(2)
        expect(res.body.data[0].title).toBe(movie3.body.data.title)
        expect(res.body.data[1].title).toBe(movie2.body.data.title)
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
        const { id } = movie1.body.data

        const res = await api.get(`/api/v1/movies/${id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.data.title).toBe(movieUtil.NEWMOVIE.title)
        expect(res.body.data.image).toBe(movieUtil.NEWMOVIE.image)
        expect(res.body.data.calification).toBeDefined()
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
      const { id } = movie1.body.data
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

    it('Can update movie with simple fields --- return 200', async () => {
      const { id } = movie1.body.data
      const res = await api
        .put(`/api/v1/movies/${id}`)
        .send(movieUtil.NEWMOVIE2)

      expect(res.statusCode).toBe(200)
      expect(res.body.data.title).not.toBe(movieUtil.NEWMOVIE.title)
      expect(res.body.data.title).toBe(movieUtil.NEWMOVIE2.title)
      expect(res.body.data.calification).not.toBe(
        movieUtil.NEWMOVIE.calification,
      )
      expect(res.body.data.calification).toBe(movieUtil.NEWMOVIE2.calification)
    })
  })
})
