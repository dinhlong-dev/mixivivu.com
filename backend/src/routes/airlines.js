const airlineController = require('../controllers/airlineController')

const router = require('express').Router()

// ADD AIRLINE
router.post('/', airlineController.addAirline)
router.get('/', airlineController.getAirline)

module.exports = router