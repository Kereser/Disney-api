const supertest = require('supertest')
const { app } = require('../../../app.js')
const charUtil = require('../../../utils/variables')
const { v4: uuidv4 } = require('uuid')

const api = supertest(app)

describe('Creating a character', () => {
  it('Can create new Character --- return 201', async () => {
    const res = await api.post('/api/v1/characters').send(charUtil.NEWCHARACTER)
    expect(res.statusCode).toBe(201)
    expect(res.body.data.name).toEqual(charUtil.NEWCHARACTER.name)
    expect(res.body.data.weight).toEqual(charUtil.NEWCHARACTER.weight)
  })

  it('Cannot create characters with the same name --- return 400', async () => {
    const res = await api.post('/api/v1/characters').send(charUtil.NEWCHARACTER)
    expect(res.statusCode).toBe(201)
    expect(res.body.data.name).toEqual(charUtil.NEWCHARACTER.name)
    expect(res.body.data.weight).toEqual(charUtil.NEWCHARACTER.weight)

    const res2 = await api
      .post('/api/v1/characters')
      .send(charUtil.NEWCHARACTER)

    expect(res2.statusCode).toBe(400)
    expect(res2.body.errors[0].message).toBe('Character already in db')
  })
})

describe('Require a character already in db', () => {
  let character1
  beforeEach(async () => {
    character1 = await api
      .post('/api/v1/characters')
      .send(charUtil.NEWCHARACTER)
    await api.post('/api/v1/characters').send(charUtil.NEWCHARACTER2)
  })

  it('Can get all character as an array with only name, image and id --- return 200', async () => {
    const res = await api.get('/api/v1/characters')

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.data[0].name).toEqual(character1.body.data.name)
    expect(res.body.data[0].id).toBeDefined()
    expect(res.body.data[0].weight).toBe(undefined)
  })

  it('Can get one character by id --- return 200', async () => {
    const { id } = character1.body.data
    const resCharacter = await api.get(`/api/v1/characters/${id}`)

    expect(resCharacter.statusCode).toBe(200)
    expect(resCharacter.body.data.name).toEqual(character1.body.data.name)
    expect(resCharacter.body.data.image).toEqual(character1.body.data.image)
  })

  it('Cannot get the character if not found --- return 404', async () => {
    const id = uuidv4()

    const resCharacter = await api.get(`/api/v1/characters/${id}`)

    expect(resCharacter.statusCode).toBe(404)
    expect(resCharacter.body.errors[0].message).toBe('Character not found')
  })

  it('Cannot get the character if malformatted id --- return 400', async () => {
    const resCharacter = await api.get(`/api/v1/characters/2905230958skgjskld`)
    expect(resCharacter.statusCode).toBe(400)
    expect(resCharacter.body.errors[0].message).toBe(
      'characterId must be a valid id',
    )
  })
})

describe('Deleting a character', () => {
  let character1
  beforeEach(async () => {
    character1 = await api
      .post('/api/v1/characters')
      .send(charUtil.NEWCHARACTER)
  })

  it('Cannot delete a character if not found/with correct id --- return 404', async () => {
    const id = uuidv4()
    const res = await api.delete(`/api/v1/characters/${id}`)

    expect(res.statusCode).toBe(404)
    expect(res.body.errors[0].message).toBeDefined()
    expect(res.body.errors[0].message).not.toBe('Route not found')
    expect(res.body.errors[0].message).toBe('Character not found')
  })

  it('Cannot delete a character with malformatted id -- return 400', async () => {
    const res = await api.delete(`/api/v1/characters/2905230958skgjskld`)

    expect(res.statusCode).toBe(400)
    expect(res.body.errors[0].message).toBe('characterId must be a valid id')
  })

  it('Can delete a character with validId --- return 204', async () => {
    const { id } = character1.body.data
    const res = await api.delete(`/api/v1/characters/${id}`)
    expect(res.statusCode).toBe(204)

    const allCharacters = await api.get('/api/v1/characters')
    expect(allCharacters.statusCode).toBe(200)
    expect(allCharacters.body.data).toHaveLength(0)
  })
})

describe('Updating user', () => {
  let character1
  beforeEach(async () => {
    character1 = await api
      .post('/api/v1/characters')
      .send(charUtil.NEWCHARACTER)
  })
  it('Cannot update if malformatted id --- return 400', async () => {
    const res = await api.put('/api/v1/characters/823765fkdgj;lskd')

    expect(res.statusCode).toBe(400)
    expect(res.body.errors[0].message).toBe('characterId must be a valid id')
  })

  it('Cannot update if character not found --- return 404', async () => {
    const id = uuidv4()

    const res = await api.put(`/api/v1/characters/${id}`)
    expect(res.statusCode).toBe(404)
    expect(res.body.errors[0].message).toBe('Character not found')
  })

  it('Can update a user in simple fields --- return 200', async () => {
    const { id } = character1.body.data

    const newCharacter = {
      name: 'Pepito moreno',
      age: 34,
    }
    const res = await api.put(`/api/v1/characters/${id}`).send(newCharacter)

    expect(res.statusCode).toBe(200)
    expect(res.body.data.name).toBe(newCharacter.name)
    expect(res.body.data.age).toBe(34)
    expect(res.body.data.image).toBe(character1.body.data.image)
  })
})
