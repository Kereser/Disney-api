const userRepository = require('../database/repository/userRepository')
const { BadRequestError, DbError } = require('../errors/errorsMessages')
const jwt = require('jsonwebtoken')
const passwordUtils = require('../utils/passwordUtils')
require('dotenv')

const register = async (email, password) => {
  let userAlreadyInDb
  try {
    userAlreadyInDb = await userRepository.getOneUserByEmail(email)
  } catch (error) {
    throw error
  }

  if (userAlreadyInDb) {
    throw new BadRequestError('Email already in use')
  }

  const hashedPassword = await passwordUtils.toHash(password)

  let newUser
  try {
    newUser = await userRepository.createOneUser(email, hashedPassword)
  } catch (error) {
    throw new DbError(error.message)
  }

  const userJwt = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
    },
    process.env.JWT_KEY,
  )

  return { newUser, userJwt }
}

const login = async (email, password) => {
  let userAlreadyInDb
  try {
    userAlreadyInDb = await userRepository.getOneUserByEmail(email)
  } catch (error) {
    throw error
  }

  if (!userAlreadyInDb) {
    throw new BadRequestError('Invalid credentials')
  }

  const passwordMatch = await passwordUtils.compare(
    userAlreadyInDb.password,
    password,
  )
  if (!passwordMatch) {
    throw new BadRequestError('Invalid credentials')
  }

  const userJwt = jwt.sign(
    {
      id: userAlreadyInDb.id,
      email: userAlreadyInDb.email,
    },
    process.env.JWT_KEY,
  )

  return { userAlreadyInDb, userJwt }
}

module.exports = { register, login }
