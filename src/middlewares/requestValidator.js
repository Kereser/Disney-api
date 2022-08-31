const { validationResult } = require('express-validator')

const requestValidator = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array().map((err) => {
        return { message: err.msg, field: err.param }
      }),
    })
  }

  next()
}

module.exports = { requestValidator }
