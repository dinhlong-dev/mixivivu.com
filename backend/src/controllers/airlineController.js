const { Airport, Booking, Flight, Passenger, Payment, User, AirLine } = require("../models/model");

const airlineController = {
    // ADD AIRLINE
    addAirline: async (req, res) => {
        const { code, name } = req.body;

        const existingAirline = await AirLine.findOne({ $or: [{ code }, { name }] });

        if (existingAirline) {
            return res.status(400).json({
                message: "Code hoặc name bị trùng!"
            });
        }

        const newAirline = new AirLine({ code, name })

        try {
            const savedAirline = await newAirline.save()
            res.status(200).json(savedAirline)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // GET ALl AIRLINE
    getAirline: async (req, res) => {
        try {
            const airline = await AirLine.find();
            res.status(200).json(airline)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = airlineController