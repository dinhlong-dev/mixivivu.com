const { Airport, Booking, Flight, Passenger, Payment, User } = require("../models/model");

const flightsController = {
    // ADD FLIGHT
    addFlight: async (req, res) => {

        const { flight_number } = req.body;
        try {
            const existingFlight = await Flight.findOne({ flight_number });
            if (existingFlight) {
                return res.status(400).json({
                    error: 'Flight number already exists'
                });
            }
            const newFlight = new Flight(req.body);
            const savedFlight = await newFlight.save();
            res.status(200).json(savedFlight);
        } catch (e) {
            console.error('Error saving flight:', e);
            res.status(500).json({
                error: 'Server error', details: e.message
            });
        }
    },

    // GET FLIGHT
    getFlight: async (req, res) => {
        try {
            const flight = await Flight.find();
            res.status(200).json(flight)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // DELETE FLIGHT
    deleteFlight: async (req, res) => {
        try {
            const deleteFlight = await Flight.deleteMany()
            res.status(200).json({
                msg: "Delete Compled"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // SEARCH FLIGHT 
    // searchFlight: async (req, res) => {
    //     const { from, to, departureDate, returnDate, adults, children, infants } = req.query;

    //     try {
    //         const totalPassengers = parseInt(adults) + parseInt(children) + parseInt(infants);

    //         const departureDateStart = new Date(departureDate); 
    //         departureDateStart.setHours(0, 0, 0, 0); 
            
    //         const departureDateEnd = new Date(departureDate); 
    //         departureDateEnd.setHours(23, 59, 59, 999);

    //         // Tìm chuyến bay đi
    //         let departureFlights = await Flight.find({
    //             departure_airport: from,
    //             arrival_airport: to,
    //             available_seats: { $gte: totalPassengers },
    //             departure_date: { $gte: departureDateStart, $lt: departureDateEnd }
    //         }).populate('departure_airport arrival_airport airline');

    //         if (!departureFlights || departureFlights.length === 0) {
    //             return res.status(404).json({ message: 'No departure flights found' });
    //         }

    //         // Tính tổng giá cho mỗi chuyến bay đi
    //         departureFlights = departureFlights.map(flight => {
    //             const totalPrice = (flight.price_adult * parseInt(adults)) +
    //                 (flight.price_child * parseInt(children)) +
    //                 (flight.price_infant * parseInt(infants));
    //             return { ...flight.toObject(), totalPrice };  // Thêm trường totalPrice
    //         });

    //         // Nếu có ngày về (khứ hồi)
    //         if (returnDate) {
    //             let returnFlights = await Flight.find({
    //                 departure_airport: to,
    //                 arrival_airport: from,
    //                 available_seats: { $gte: totalPassengers },
    //                 departure_date: { $gte: new Date(returnDate) }
    //             }).populate('departure_airport arrival_airport airline');

    //             if (!returnFlights || returnFlights.length === 0) {
    //                 console.log('No return flights found, returning only departure flights');
    //                 return res.json({ 
    //                     departureFlights,
    //                     returnFlights: 'khong tim thay'
    //                 });  // Không tìm thấy chuyến bay về, trả về chỉ chuyến bay đi
    //             }

    //             // Tính tổng giá cho mỗi chuyến bay về
    //             returnFlights = returnFlights.map(flight => {
    //                 const totalPrice = (flight.price_adult * parseInt(adults)) +
    //                     (flight.price_child * parseInt(children)) +
    //                     (flight.price_infant * parseInt(infants));
    //                 return { ...flight.toObject(), totalPrice };  // Thêm trường totalPrice
    //             });

    //             return res.json({ departureFlights, returnFlights });
    //         }

    //         // Trả về chuyến bay một chiều với giá vé
    //         res.json({ departureFlights });

    //     } catch (error) {
    //         console.error('Error fetching flights:', error);  // Log lỗi chi tiết
    //         res.status(500).json({ message: 'Error fetching flights', error });
    //     }
    // },

    // searchFlight: async (req, res) => {
    //     const { from, to, departureDate, returnDate, adults, children, infants } = req.query;
    
    //     try {
    //         const totalPassengers = parseInt(adults) + parseInt(children) + parseInt(infants);
    
    //         // Chuyển đổi chuỗi ngày thành đối tượng Date và đặt thời gian bằng 00:00:00 để đảm bảo sự chính xác khi so sánh
    //         const departureDateStart = new Date(departureDate);
    //         departureDateStart.setHours(0, 0, 0, 0);
    
    //         const departureDateEnd = new Date(departureDate);
    //         departureDateEnd.setHours(23, 59, 59, 999);
    
    //         // Tìm chuyến bay đi
    //         let departureFlights = await Flight.find({
    //             departure_airport: from,
    //             arrival_airport: to,
    //             available_seats: { $gte: totalPassengers },
    //             departure_date: { $gte: departureDateStart, $lt: departureDateEnd } // Tạo khoảng ngày để so sánh
    //         }).populate('departure_airport arrival_airport airline');
    
    //         if (!departureFlights || departureFlights.length === 0) {
    //             return res.json({ message: 'Không có chuyến bay nào vào ngày này' })
    //         }
    
    //         // Tính tổng giá cho mỗi chuyến bay đi
    //         departureFlights = departureFlights.map(flight => {
    //             const totalPrice = (flight.price_adult * parseInt(adults)) +
    //                 (flight.price_child * parseInt(children)) +
    //                 (flight.price_infant * parseInt(infants));
    //             return { ...flight.toObject(), totalPrice };  // Thêm trường totalPrice
    //         });
    
    //         // Nếu có ngày về (khứ hồi)
    //         if (returnDate) {
    //             const returnDateStart = new Date(returnDate);
    //             returnDateStart.setHours(0, 0, 0, 0);
    
    //             const returnDateEnd = new Date(returnDate);
    //             returnDateEnd.setHours(23, 59, 59, 999);
    
    //             let returnFlights = await Flight.find({
    //                 departure_airport: to,
    //                 arrival_airport: from,
    //                 available_seats: { $gte: totalPassengers },
    //                 departure_date: { $gte: returnDateStart, $lt: returnDateEnd } // Tạo khoảng ngày để so sánh
    //             }).populate('departure_airport arrival_airport airline');
    
    //             if (!returnFlights || returnFlights.length === 0) {
    //                 console.log('No return flights found, returning only departure flights');
    //                 return res.json({ 
    //                     departureFlights,
    //                     returnFlights: 'Không tìm thấy chuyến bay về'
    //                 });  // Không tìm thấy chuyến bay về, trả về chỉ chuyến bay đi
    //             }
    
    //             // Tính tổng giá cho mỗi chuyến bay về
    //             returnFlights = returnFlights.map(flight => {
    //                 const totalPrice = (flight.price_adult * parseInt(adults)) +
    //                     (flight.price_child * parseInt(children)) +
    //                     (flight.price_infant * parseInt(infants));
    //                 return { ...flight.toObject(), totalPrice };  // Thêm trường totalPrice
    //             });
    
    //             return res.json({ departureFlights, returnFlights });
    //         }
    
    //         // Trả về chuyến bay một chiều với giá vé
    //         res.json({ departureFlights });
    
    //     } catch (error) {
    //         console.error('Error fetching flights:', error);  // Log lỗi chi tiết
    //         res.status(500).json({ message: 'Error fetching flights', error });
    //     }
    // },

    searchFlight: async (req, res) => {
        const { from, to, departureDate, returnDate, adults, children, infants } = req.query;
    
        try {
            const totalPassengers = parseInt(adults) + parseInt(children) + parseInt(infants);
    
            // Chuyển đổi chuỗi ngày thành đối tượng Date và đặt thời gian bằng 00:00:00 để đảm bảo sự chính xác khi so sánh
            const departureDateStart = new Date(departureDate);
            departureDateStart.setHours(0, 0, 0, 0);
    
            const departureDateEnd = new Date(departureDate);
            departureDateEnd.setHours(23, 59, 59, 999);
    
            // Tìm chuyến bay đi
            let departureFlights = await Flight.find({
                departure_airport: from,
                arrival_airport: to,
                available_seats: { $gte: totalPassengers },
                departure_date: { $gte: departureDateStart, $lt: departureDateEnd } // Tạo khoảng ngày để so sánh
            }).populate('departure_airport arrival_airport airline');
    
            if (!departureFlights || departureFlights.length === 0) {
                return res.json({ message: 'Không có chuyến bay nào vào ngày này' }); // Trả về thông báo thay vì lỗi
            }
    
            // Tính tổng giá cho mỗi chuyến bay đi
            departureFlights = departureFlights.map(flight => {
                const totalPrice = (flight.price_adult * parseInt(adults)) +
                    (flight.price_child * parseInt(children)) +
                    (flight.price_infant * parseInt(infants));
                return { ...flight.toObject(), totalPrice };  // Thêm trường totalPrice
            });
    
            // Nếu có ngày về (khứ hồi)
            if (returnDate) {
                const returnDateStart = new Date(returnDate);
                returnDateStart.setHours(0, 0, 0, 0);
    
                const returnDateEnd = new Date(returnDate);
                returnDateEnd.setHours(23, 59, 59, 999);
    
                let returnFlights = await Flight.find({
                    departure_airport: to,
                    arrival_airport: from,
                    available_seats: { $gte: totalPassengers },
                    departure_date: { $gte: returnDateStart, $lt: returnDateEnd } // Tạo khoảng ngày để so sánh
                }).populate('departure_airport arrival_airport airline');
    
                if (!returnFlights || returnFlights.length === 0) {
                    console.log('No return flights found, returning only departure flights');
                    return res.json({ 
                        departureFlights,
                        returnFlights: 'không tìm thấy chuyến bay về'
                    });  // Không tìm thấy chuyến bay về, trả về chỉ chuyến bay đi
                }
    
                // Tính tổng giá cho mỗi chuyến bay về
                returnFlights = returnFlights.map(flight => {
                    const totalPrice = (flight.price_adult * parseInt(adults)) +
                        (flight.price_child * parseInt(children)) +
                        (flight.price_infant * parseInt(infants));
                    return { ...flight.toObject(), totalPrice };  // Thêm trường totalPrice
                });
    
                return res.json({ departureFlights, returnFlights });
            }
    
            // Trả về chuyến bay một chiều với giá vé
            res.json({ departureFlights });
    
        } catch (error) {
            console.error('Error fetching flights:', error);  // Log lỗi chi tiết
            res.status(500).json({ message: 'Error fetching flights', error });
        }
    }    
}

module.exports = flightsController