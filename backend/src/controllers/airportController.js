const { Airport, Booking, Flight, Passenger, Payment, User } = require("../models/model");

const airportController = {
  //ADD AIRPORT
  addAirport: async (req, res) => {
    try {
      const newAirport = new Airport(req.body)
      const saveAirport = await newAirport.save()
      res.status(200).json(saveAirport)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // GET ALL AIRPORT
  getAllAirport: async (req, res) => {
    try {
      const airport = await Airport.find()
      res.status(200).json(airport)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // SEARCH AIRPORT
  searchAirport: async (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        error: 'Query parameter is required'
      });
    }
    try {
      const airports = await Airport.find({
        $or: [
          { code: { $regex: query, $options: 'i' } },
          { name: { $regex: query, $options: 'i' } }
        ]
      }).limit(10); // Giới hạn kết quả tìm kiếm 
      res.json(airports);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = airportController;  