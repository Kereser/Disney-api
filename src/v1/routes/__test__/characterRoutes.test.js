const supertest = require('supertest')
const { app } = require('../../../app.js')
const charUtil = require('../../../utils/variables')

const api = supertest(app)

it('Can create new Character', async () => {
  const res = await api.post('/api/v1/characters').send(charUtil.NEWCHARACTER)

  expect(res.statusCode).toBe(201)
  expect(res.body.name).toEqual('Juanito perez')
  expect(res.body.weight).toEqual(234.5)
})

it('Can get all character as an array with only name and image', async () => {
  await api.post('/api/v1/characters').send(charUtil.NEWCHARACTER2)
  await api.post('/api/v1/characters').send(charUtil.NEWCHARACTER)
  const res = await api.get('/api/v1/characters')

  expect(res.statusCode).toBe(200)
  expect(res.body).toHaveLength(2)
  expect(res.body[0].name).toEqual('John doe')
  expect(res.body[0].weight).toBe(undefined)
})

it('Can get one character by id', async () => {
  const newCharacter = await api
    .post('/api/v1/characters')
    .send(charUtil.NEWCHARACTER)

  const { id } = newCharacter.body
  const resCharacter = await api.get(`/api/v1/characters/${id}`)

  expect(resCharacter.statusCode).toBe(200)
  expect(resCharacter.body.name).toEqual(charUtil.NEWCHARACTER.name)
  expect(resCharacter.body.image).toEqual(charUtil.NEWCHARACTER.image)
})
