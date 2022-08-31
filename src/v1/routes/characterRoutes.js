const characterController = require('../../controllers/characterController')
const { body } = require('express-validator')
const { requestValidator } = require('../../middlewares/requestValidator')
const express = require('express')
const router = express.Router()

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
