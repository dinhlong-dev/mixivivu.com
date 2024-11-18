const bookingController = require("../controllers/bookingController")

const router = require("express").Router();

// ADD BOOKING
router.post("/", bookingController.addBooking)