const bookingController = require("../controllers/bookingController")

const router = require("express").Router();

// API tạo booking
router.post('/', bookingController.createBooking);

router.delete('/', bookingController.deleteBooking);

router.get('/stats', bookingController.getBookingStats);

router.get('/', bookingController.getAllBookings);

module.exports = router