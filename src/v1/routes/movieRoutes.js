const movieController = require('../../controllers/movieController')
const { requestValidator } = require('../../middlewares/requestValidator')
const { body } = require('express-validator')
const express = require('express')
const router = express.Router()

/**
 *  @openapi
 *  /api/v1/movies:
 *    get:
 *      tags:
 *        - Movies
 *      description: 'Return all movies in db'
 *      parameters:
 *        - in: query
 *          name: title
 *          schema:
 *            type: string
 *            example: 'El padrino'
 *          description: 'Startswith: title --- case insensitive'
 *        - in: query
 *          name: genre
 *          schema:
 *            type: string
 *            example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *          description: 'Genreid'
 *        - in: query
 *          name: order
 *          schema:
 *            type: string
 *            example: ASC || DESC
 *          description: 'Return movies in ascending or descending order'
 *      responses:
 *        200:
 *          description: Array of all movies that fulfill query params or the entire list of books
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
 *                        title:
 *                          type: string
 *                          example: Interestellar
 *                        image:
 *                          type: string
 *                          example: interestellar.jpg
 *                        creationDate:
 *                          type: string
 *                          example: '2018-05-12'
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
 *  /api/v1/movies/{movieId}:
 *    get:
 *      tags:
 *        - Movies
 *      description: 'Return one movie with given id'
 *      parameters:
 *        - name: movieId
 *          in: path
 *          description: ID of the request movie
 *          required: true
 *          schema:
 *            type: string
 *            example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *      responses:
 *        200:
 *          description: 'Requested movie'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Movie'
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
 *                          example: 'movieId must be a valid id'
 *        404:
 *          description: 'Movie with the request Id not found'
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
 *                          example: 'Movie not found'
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
 *  /api/v1/movies/:
 *    post:
 *      tags:
 *        - Movies
 *      description: 'Add new movie'
 *      requestBody:
 *        description: 'Details of new movie'
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                type: object
 *                required: [title, creationDate]
 *                properties:
 *                  title:
 *                    type: string
 *                    example: Interestellar
 *                  image:
 *                    type: string
 *                    example: interestellar.jpg
 *                  creationDate:
 *                    type: string
 *                    example: '2018-05-12'
 *                  calification:
 *                    type: double
 *                    example: 9.1
 *                  characters:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: [61dbae02-c147-4e28-863c-db7bd402b2d6, opdbae02-c147-4e28-863c-db7bd4025grt]
 *
 *      responses:
 *        201:
 *          description: 'Details of the added movie'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Movie'
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
 *          description: 'Movie with the request Id not found'
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
 *  /api/v1/movies/{movieId}:
 *    put:
 *      tags:
 *        - Movies
 *      description: 'Update a movie'
 *      parameters:
 *        - name: movieId
 *          in: path
 *          description: ID of the request movie
 *          required: true
 *          schema:
 *            type: string
 *            example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *      requestBody:
 *        description: 'Fields to update on movie'
 *        required: true
 *        content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    example: Interestellar
 *                  image:
 *                    type: string
 *                    example: interestellar.jpg
 *                  creationDate:
 *                    type: string
 *                    example: '2018-05-12'
 *                  calification:
 *                    type: double
 *                    example: 9.1
 *                  characters:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: [61dbae02-c147-4e28-863c-db7bd402b2d6, opdbae02-c147-4e28-863c-db7bd4025grt]
 *
 *      responses:
 *        201:
 *          description: 'Details of the modified movie'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Movie'
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
 *          description: 'Movie with the request Id not found'
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
 *  /api/v1/movies/{movieId}:
 *    delete:
 *      tags:
 *        - Movies
 *      description: 'Deleting a movie'
 *      parameters:
 *        - name: movieId
 *          in: path
 *          description: ID of the request movie
 *          required: true
 *          schema:
 *            type: string
 *            example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *      responses:
 *        204:
 *          description: 'Movie successfully deleted'
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
 *                          example: 'movieId must be a valid id'
 *        404:
 *          description: 'Movie with the request Id not found'
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
 *                          example: 'Movie not found'
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

router.get('/', movieController.getAllMovies)

router.get('/:movieId', movieController.getOneMovie)

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title must be provided'),
    body('creationDate')
      .notEmpty()
      .withMessage('Creation date must be provided'),
  ],
  requestValidator,
  movieController.createNewMovie,
)

router.put('/:movieId', movieController.updateOneMovie)

router.delete('/:movieId', movieController.deleteOneMovie)

module.exports = router
