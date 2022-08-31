const supertest = require('supertest')
const { app } = require('../../../app.js')
const Utils = require('../../../utils/variables')

const api = supertest(app)

describe('Not required users in db', () => {
  describe('Login', () => {
    it('Email and password must be valids to login --- return 400', async () => {
      const res = await api.post('/api/v1/auth/login').send(Utils.NONVALIDUSER1)

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('Email must be valid')

      const resPassword = await api
        .post('/api/v1/auth/login')
        .send(Utils.NONVALIDUSER2)

      expect(resPassword.statusCode).toBe(400)
      expect(resPassword.body.errors[0].message).toBe(
        'You must supply a password',
      )
    })
  })

  describe('Register', () => {
    it('Can register in the app --- return 201', async () => {
      const res = await api.post('/api/v1/auth/register').send(Utils.USER1)

      expect(res.statusCode).toBe(201)
      expect(res.body.data.email).toBe(Utils.USER1.email)
      expect(res.body.data.password).not.toBeDefined()
    })

    it('Set cookie after successful signup --- return 201', async () => {
      const res = await api.post('/api/v1/auth/register').send(Utils.USER2)

      expect(res.statusCode).toBe(201)
      expect(res.get('Set-Cookie')).toBeDefined()
    })

    it('Email and password must be valids to register --- return 400', async () => {
      const res = await api
        .post('/api/v1/auth/register')
        .send(Utils.NONVALIDUSER1)

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('Email must be valid')

      const resPassword = await api
        .post('/api/v1/auth/register')
        .send(Utils.NONVALIDUSER2)

      expect(resPassword.statusCode).toBe(400)
      expect(resPassword.body.errors[0].message).toBe(
        'You must supply a password',
      )
    })
  })
})

describe('Require users at db', () => {
  let user1
  beforeEach(async () => {
    user1 = await api.post('/api/v1/auth/register').send(Utils.USER2)
  })

  describe('Login', () => {
    it('Can login with valid fields --- return 201', async () => {
      const res = await api.post('/api/v1/auth/login').send(Utils.USER2)

      expect(res.statusCode).toBe(200)
      expect(res.body.data.email).toBe(Utils.USER2.email)
      expect(res.body.data.password).not.toBeDefined()
      expect(res.get('Set-Cookie')).toBeDefined()
    })

    it('Cannot login if invalid credentials --- return 400', async () => {
      const passwordRes = await api
        .post('/api/v1/auth/login')
        .send({ email: Utils.USER2.email, password: 'nosoypassword' })

      expect(passwordRes.statusCode).toBe(400)
      expect(passwordRes.body.errors[0].message).toBe('Invalid credentials')

      const emailRes = await api
        .post('/api/v1/auth/login')
        .send({ email: Utils.USER1.email, password: Utils.USER2.password })

      expect(emailRes.statusCode).toBe(400)
      expect(emailRes.body.errors[0].message).toBe('Invalid credentials')
    })
  })

  describe('Register', () => {
    it('Cannot create new user with the same email --- return 400', async () => {
      const res = await api.post('/api/v1/auth/register').send(Utils.USER2)

      expect(res.statusCode).toBe(400)
      expect(res.body.errors[0].message).toBe('Email already in use')
    })
  })
})
