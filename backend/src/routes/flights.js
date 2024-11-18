const flightsController = require("../controllers/flightsController")

const router = require("express").Router()

router.post("/", flightsController.addFlight)

module.exports = router