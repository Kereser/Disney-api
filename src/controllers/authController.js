const register = async (req, res) => {
  const { email, password } = req.body

  const newUser = await authService.register(email, password)
  res.sendStatus(200)
}

const login = (req, res) => {
  const { email, password } = req.body

  res.sendStatus(200)
}

module.exports = { register, login }
