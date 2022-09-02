const characterController = require('../../controllers/characterController')
const { body } = require('express-validator')
const { requestValidator } = require('../../middlewares/requestValidator')
const express = require('express')
const router = express.Router()

/**
 *  @openapi
 *  /api/v1/characters:
 *    get:
 *      tags:
 *        - Characters
 *      description: 'Gettin all characters in db'
 *      parameters:
 *        - in: query
 *          name: name
 *          description: 'Filter by name'
 *          schema:
 *            type: string
 *            example: Brad
 *        - in: query
 *          name: age
 *          description: 'Filter by age'
 *          schema:
 *            type: integer
 *            example: 25
 *        - in: query
 *          name: weight
 *          description: 'Filter by weight'
 *          schema:
 *            type: double
 *            example: 154.5
 *        - in: query
 *          name: movie
 *          description: 'Filter by movieId assocciated with a character'
 *          schema:
 *            type: string
 *            example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *      responses:
 *        200:
 *          description: 'Array of all characters with applied filters if apply'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *                        name:
 *                          type: string
 *                          example: Brad
 *                        image:
 *                          type: string
 *                          example: brad.jpg
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
 *                          example: "Some db error message"
 *
 *  @openapi
 *  /api/v1/characters/{characterId}:
 *    get:
 *      tags:
 *        - Characters
 *      description: 'Get one character with the given id'
 *      parameters:
 *        - name: characterId
 *          in: path
 *          description: ID of the requested character
 *          required: true
 *          schema:
 *            type: string
 *            example: 61dbae02-c147-93er-863c-db7bd402b2d6
 *      responses:
 *        200:
 *          description: 'Requested character'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Character'
 *        400:
 *          description: 'Malformatted id'
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
 *                          example: 'characterId must be a valid id'
 *        404:
 *          description: 'Character with the request Id not found'
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
 *                          example: 'Character not found'
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
 *                          example: "Some db error message"
 *
 *  @openapi
 *  /api/v1/characters/:
 *    post:
 *      tags:
 *        - Characters
 *      description: 'Add new character'
 *      requestBody:
 *        description: 'Fields of new character'
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [name]
 *              properties:
 *                name:
 *                  type: string
 *                  example: Brad pitt
 *                age:
 *                  type: integer
 *                  example: 43
 *                weight:
 *                  type: double
 *                  example: 200.1
 *                history:
 *                  type: string
 *                  example: 'Bard pitt story of his life'
 *                image:
 *                  type: string
 *                  example: brad_pit.jpg
 *                movies:
 *                  type: array
 *                  items:
 *                    type: string
 *                    example: [61dbae02-c147-4e28-863c-db7bd402b2d6, opdbae02-c147-4e28-863c-db7bd4025grt]
 *      responses:
 *        201:
 *          description: 'Details of the added character'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Character'
 *        400:
 *          description: 'Malformatted id'
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
 *                          example: 'movieId must be a valid id || characterId must be a valid id'
 *        404:
 *          description: 'Character with the request Id not found'
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
 *                          example: 'Movie not found || Character not found'
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
 *                          example: "Some db error message"
 *
 *  @openapi
 *  /api/v1/characters/{characterId}:
 *    put:
 *      tags:
 *        - Characters
 *      description: 'Update a character'
 *      parameters:
 *        - name: characterId
 *          in: path
 *          description: ID of the requested character
 *          required: true
 *          schema:
 *            type: string
 *            example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *      requestBody:
 *        description: 'Fields to update on character'
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [name]
 *              properties:
 *                name:
 *                  type: string
 *                  example: Brad pitt
 *                age:
 *                  type: integer
 *                  example: 43
 *                weight:
 *                  type: double
 *                  example: 200.1
 *                history:
 *                  type: string
 *                  example: 'Bard pitt story of his life'
 *                image:
 *                  type: string
 *                  example: brad_pit.jpg
 *                movies:
 *                  type: array
 *                  items:
 *                    type: string
 *                    example: [61dbae02-c147-4e28-863c-db7bd402b2d6, opdbae02-c147-4e28-863c-db7bd4025grt]
 *      responses:
 *        201:
 *          description: 'Details of the modified character'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Character'
 *        400:
 *          description: 'Malformatted id'
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
 *                          example: 'movieId must be a valid id || characterId must be a valid id'
 *        404:
 *          description: 'Character with the request Id not found'
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
 *                          example: 'Movie not found || Character not found'
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
 *                          example: "Some db error message"
 *
 *  @openapi
 *  /api/v1/characters/{characterId}:
 *    delete:
 *      tags:
 *        - Characters
 *      description: 'Delete a character'
 *      parameters:
 *        - name: characterId
 *          in: path
 *          description: ID of the requested character
 *          required: true
 *          schema:
 *            type: string
 *            example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *      responses:
 *        204:
 *          description: 'Character successfully deleted'
 *        400:
 *          description: 'Malformatted id'
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
 *                          example: 'characterId must be a valid id'
 *        404:
 *          description: 'Character with the request Id not found'
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
 *                          example: 'Character not found'
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
 *                          example: "Some db error message"
 */

router.get('/', characterController.getAllCharacters)

router.get('/:characterId', characterController.getOneCharacter)

router.post(
  '/',
  [body('name').notEmpty().withMessage('Name must be provided')],
  requestValidator,
  characterController.createNewCharacter,
)

router.put('/:characterId', characterController.updateCharacter)

router.delete('/:characterId', characterController.deleteCharacter)

module.exports = router
