const { Airport, Booking, Flight, Passenger, Payment, User } = require("../models/model");

const flightsController = {
    // ADD FLIGHT
    addFlight: async (req, res) => {
        const { flightNumber } = req.body
        try {
            const existingFlight = await Flight.findOne({ flightNumber });
            if (existingFlight) {
                return res.status(400).json({ error: 'Flight number already exists' });
            }
            const newFlight = new Flight(req.body);
            const savedFlight = await newFlight.save();
            res.status(200).json(savedFlight)
        } catch (e) {
            res.status(500).json(e)
        }
    }
}

module.exports = flightsController