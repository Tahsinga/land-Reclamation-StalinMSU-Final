const express = require('express')
const router = express.Router()
const dataController = require('../controllers/dataController')
const authMiddleware = require('../middleware/authMiddleware')
const verifyToken = authMiddleware.verifyToken
const allowRoles = authMiddleware.allowRoles

router.get('/sections', verifyToken, dataController.getSection)
router.get('/boreholes', verifyToken, dataController.getBoreholes)
router.get('/survey-measurements', verifyToken, allowRoles('surveyor'), dataController.getSurveyMeasurements)
router.post('/survey-measurements', verifyToken, allowRoles('surveyor'), dataController.addSurveyMeasurement)
router.put('/survey-measurements/:id', verifyToken, allowRoles('surveyor'), dataController.updateSurveyMeasurement)
router.get('/geological', verifyToken, allowRoles('surveyor', 'geologist'), dataController.getGeological)
router.post('/geological', verifyToken, allowRoles('geologist'), dataController.addGeological)
router.put('/geological/:id', verifyToken, allowRoles('geologist'), dataController.updateGeological)
router.get('/geotechnical', verifyToken, allowRoles('surveyor', 'miner'), dataController.getGeotechnical)
router.post('/geotechnical', verifyToken, allowRoles('miner'), dataController.addGeotechnical)
router.put('/geotechnical/:id', verifyToken, allowRoles('miner'), dataController.updateGeotechnical)
router.get('/analysis-ids', verifyToken, dataController.getPillarIds)
router.post('/analysis', verifyToken, dataController.analyzePillars)

module.exports = router