const supertest = require('supertest')
const { app } = require('../../../app.js')

const api = supertest(app)

it('Can get all character as an array', async () => {
  const res = await api.get('/api/v1/characters')

  console.log(process.env.NODE_ENV)
  console.log('Mi data', res.body)
})
