const movieController = require('../../controllers/movieController')
const express = require('express')
const router = express.Router()

router.get('/', movieController.getAllMovies)

router.post('/', movieController.createNewMovie)

module.exports = router
