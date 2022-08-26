const supertest = require('supertest')
const { app } = require('../../../app.js')
const movieUtil = require('../../../utils/variables')
const { v4: uuidv4 } = require('uuid')

const api = supertest(app)

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

describe('require movies in db', () => {
  let movie1
  beforeEach(async () => {
    movie1 = await api.post('/api/v1/movies').send(movieUtil.NEWMOVIE)
  })

  it('Cannot create a movie with existing title in db --- return 400', async () => {
    const res2 = await api.post('/api/v1/movies').send(movieUtil.NEWMOVIE)
    expect(res2.statusCode).toBe(400)
    expect(res2.body.errors[0].message).toContain('already in db')
  })

  it('Return all movies with title, image, creationDate and id', async () => {
    const res = await api.get('/api/v1/movies')

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].title).toBe(movie1.body.data.title)
    expect(res.body.data[0].calification).not.toBeDefined()
  })
})
