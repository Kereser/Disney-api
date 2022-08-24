const characterController = require('../../controllers/characterController')
const express = require('express')
const router = express.Router()

router.get('/', characterController.getAllCharacters)

router.get('/:characterId', characterController.getOneCharacter)

router.post('/', characterController.createNewCharacter)

router.put('/:characterId', characterController.updateCharacter)

module.exports = router
