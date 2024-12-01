const airlineController = require('../controllers/airlineController')

const router = require('express').Router()

// ADD AIRLINE
router.post('/', airlineController.addAirline)
router.get('/', airlineController.getAirline)

router.delete('/:id', airlineController.deleteAirline)

router.put('/:id', airlineController.updateAirline)

router.get('/search', airlineController.searchAirline)
module.exports = router