const authService = require('../services/authService')

const register = async (req, res) => {
  const { email, password } = req.body

  try {
    const { newUser, userJwt } = await authService.register(email, password)
    req.session = {
      jwt: userJwt,
    }

    res.status(201).send({ data: newUser })
  } catch (error) {
    res.status(error.statusCode).send({ errors: error.errMsg() })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const { userAlreadyInDb, userJwt } = await authService.login(
      email,
      password,
    )
    req.session = {
      jwt: userJwt,
    }

    res.status(200).send({ data: userAlreadyInDb })
  } catch (error) {
    res.status(error.statusCode).send({ errors: error.errMsg() })
  }
}

module.exports = { register, login }
