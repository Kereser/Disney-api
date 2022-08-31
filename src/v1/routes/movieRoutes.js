const movieController = require('../../controllers/movieController')
const { requestValidator } = require('../../middlewares/requestValidator')
const { body } = require('express-validator')
const express = require('express')
const router = express.Router()

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
