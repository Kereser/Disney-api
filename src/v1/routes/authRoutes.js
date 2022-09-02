const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const authController = require('../../controllers/authController')
const { requestValidator } = require('../../middlewares/requestValidator')

/**
 *  @openapi
 *  /api/v1/auth/login:
 *    post:
 *      tags:
 *        - Auth
 *      description: 'Route to login in application'
 *      requestBody:
 *        description: 'Email and password of the user'
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [email, password]
 *              properties:
 *                email:
 *                  type: string
 *                  example: 'test@test.com'
 *                password:
 *                  type: string
 *                  format: /\w{4,}/
 *                  example: password
 *      responses:
 *        201:
 *          description: 'Email and id of user --- cookie with token.'
 *          headers:
 *            Set-Cookie:
 *              schema:
 *                type: string
 *                example: session=jwt; path=/; httponly
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                    example: 'test@test.com'
 *                  id:
 *                    type: string
 *                    example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *        400:
 *          description: 'Non valid credentials'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  errors:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: 'Invalid credentials'
 *        5XX:
 *          description: FAILED
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  errors:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: "Unexpected error"
 *
 *  @openapi
 *  /api/v1/auth/register:
 *    post:
 *      tags:
 *        - Auth
 *      description: 'Route to register in application'
 *      requestBody:
 *        description: 'New email and password'
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [email, password]
 *              properties:
 *                email:
 *                  type: string
 *                  example: 'test@test.com'
 *                password:
 *                  type: string
 *                  format: /\w{4,}/
 *                  example: password
 *      responses:
 *        201:
 *          description: 'Email and id of user --- cookie with token.'
 *          headers:
 *            Set-Cookie:
 *              schema:
 *                type: string
 *                example: session=jwt; path=/; httponly
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                    example: 'test@test.com'
 *                  id:
 *                    type: string
 *                    example: 61dbae02-c147-4e28-123f-db7bd402b2d6
 *        400:
 *          description: 'Email already in use'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  errors:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: 'Email already in use'
 *        5XX:
 *          description: FAILED
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  errors:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: "Unexpected error"
 */

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
