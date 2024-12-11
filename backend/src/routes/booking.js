const bookingController = require("../controllers/bookingController")

const router = require("express").Router();

// API tạo booking
router.post('/', bookingController.createBooking);

router.delete('/', bookingController.deleteBooking);

module.exports = router