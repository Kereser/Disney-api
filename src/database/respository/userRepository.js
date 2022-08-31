const { DbError } = require('../../errors/errorsMessages')
const { User } = require('../models/User')

const getOneUserByEmail = async (email) => {
  try {
    const res = await User.findOne({ where: { email } })
    return res ? res : null
  } catch (error) {
    throw new DbError(error.message)
  }
}

const createOneUser = (email, password) => {
  try {
    const newUser = User.create({ email, password })
    return newUser
  } catch (error) {
    throw new DbError(error.message)
  }
}

module.exports = { getOneUserByEmail, createOneUser }
