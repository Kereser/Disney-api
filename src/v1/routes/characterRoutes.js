import characterController from '../../controllers/characterController.js'

import express from 'express'
const router = express.Router()

router.get('/', characterController.getAllCharacters)

router.post('/', characterController.createNewCharacter)

router.put(
  '/:characterId/movies/:movieId',
  characterController.updateCharacterMovie,
)

router.put('/:characterId')

export default router
