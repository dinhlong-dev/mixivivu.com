const flightsController = require("../controllers/flightsController")

const router = require("express").Router()

router.post('/', flightsController.addFlight)
router.get('/', flightsController.getFlight)
router.delete('/', flightsController.deleteFlight)
router.get('/search', flightsController.searchFlight)

module.exports = router