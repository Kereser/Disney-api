const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const authController = require('../../controllers/authController')
const { requestValidator } = require('../../middlewares/requestValidator')

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage('Password doesnt meet minimun requirements'),
  ],
  requestValidator,
  authController.login,
)

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage('Password doesnt meet minimun requirements'),
  ],
  requestValidator,
  authController.register,
)

module.exports = router
