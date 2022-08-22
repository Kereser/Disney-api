import characterController from '../../controllers/characterController.js'

import express from 'express'
const router = express.Router()

router.get('/', characterController.getAll)

export default router
