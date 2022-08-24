import characterController from '../../controllers/characterController.js'

import express from 'express'
const router = express.Router()

router.get('/', characterController.getAllCharacters)

router.get('/:characterId', characterController.getOneCharacter)

router.post('/', characterController.createNewCharacter)

router.put('/:characterId', characterController.updateCharacter)

export default router
