const flightsController = require("../controllers/flightsController")

const router = require("express").Router()

router.post('/', flightsController.addFlight)
router.get('/', flightsController.getFlight)
router.delete('/', flightsController.deleteFlight)
router.get('/search', flightsController.searchFlight)

router.post('/add-many', flightsController.addManyFlight)

router.get('/search-by-number', flightsController.getFlightByNumber)

router.get('/airlines', flightsController.getFlightsByAirlineIds)

module.exports = router