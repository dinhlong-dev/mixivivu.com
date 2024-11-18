const airportController = require("../controllers/airportController");

const router = require("express").Router();

//ADD AIRPORT
router.post("/", airportController.addAirport)

//GET ALL AIRPORT
router.get("/", airportController.getAllAirport)

// SEARCH AIRPORT
router.get("/search", airportController.searchAirport)

module.exports = router;