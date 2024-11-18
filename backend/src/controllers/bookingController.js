const {Airport, Booking, Flight, Passenger, Payment, User} = require("../models/model");

const bookingController = {
    // ADD BOOKING
    addBooking: async (req, res) => {
        try {
            const newBooking = new Booking(req.body);
            const savedBooking = await newBooking.save()
        } catch (error) {
            res.status(500).json(500)
        }
    }
};

module.exports = bookingController