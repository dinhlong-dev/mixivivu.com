const airportController = require("../controllers/airportController");

const router = require("express").Router();

//ADD MANY AIRPORT
router.post("/", airportController.addAirport)

//ADD A AIRPORT
router.post("/add", airportController.addaAirport)

// UPDATE AIRPORT
router.put('/:id', airportController.updateAirport)

//GET ALL AIRPORT
router.get("/", airportController.getAllAirport)

// SEARCH AIRPORT
router.get("/search", airportController.searchAirport)

// DELETE A AIRPORT
router.delete('/:id', airportController.deleteAirportId)

module.exports = router;