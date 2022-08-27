const movieController = require('../../controllers/movieController')
const express = require('express')
const router = express.Router()

router.get('/', movieController.getAllMovies)

router.get('/:movieId', movieController.getOneMovie)

router.post('/', movieController.createNewMovie)

router.put('/:movieId', movieController.updateOneMovie)

router.delete('/:movieId', movieController.deleteOneMovie)

module.exports = router
