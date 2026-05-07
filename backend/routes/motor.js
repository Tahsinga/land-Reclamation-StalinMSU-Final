const express = require('express')
const router = express.Router()
const motorController = require('../controllers/motorController')
const authMiddleware = require('../middleware/authMiddleware')
const verifyToken = authMiddleware.verifyToken

router.post('/activate', verifyToken, motorController.activateMotor)

module.exports = router