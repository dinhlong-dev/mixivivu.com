const { Airport, Booking, Flight, Passenger, Payment, User } = require("../models/model");
const moment = require('moment-timezone')

const flightsController = {
    // ADD FLIGHT
    addFlight: async (req, res) => {
        const { flight_number } = req.body;

        try {
            // Kiểm tra nếu flight_number đã tồn tại
            const existingFlight = await Flight.findOne({ flight_number });
            if (existingFlight) {
                return res.status(400).json({
                    error: 'Flight number already exists'
                });
            }

            // Tạo chuyến bay mới
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

    addManyFlight: async (req, res) => {
        try {
            const flightsData = req.body;

            if (!Array.isArray(flightsData) || flightsData.length === 0) {
                return res.status(400).json({
                    msg: 'Dữ liệu đầu vào không hợp lệ'
                })
            }

            const newFlights = await Flight.insertMany(flightsData)

            res.status(200).json({
                msg: 'Da them thanh cong',
                flightsData: flightsData
            })
        } catch (error) {
            res.status(500).json({
                msg: 'Có lỗi xảy ra khi thêm sân bay',
                error: error
            })
        }
    },

    // GET FLIGHT
    getFlight: async (req, res) => {
        try {
            const flights = await Flight.find()
                .populate('departure_airport')
                .populate('arrival_airport')
                .populate('airline');

            const adjustedFlights = flights.map(flight => {
                // Convert departure_date và arrival_date từ UTC sang UTC+7
                const departureDate = new Date(flight.departure_date);
                const arrivalDate = new Date(flight.arrival_date);

                // Thêm 7 giờ cho múi giờ UTC+7
                const OFFSET_MS = 7 * 60 * 60 * 1000; // 7 giờ * 60 phút * 60 giây * 1000 mili giây

                // Tạo lại đối tượng Date với múi giờ UTC+7
                const adjustedDepartureDate = new Date(departureDate.getTime() - OFFSET_MS);
                const adjustedArrivalDate = new Date(arrivalDate.getTime() - OFFSET_MS);

                // Cập nhật lại các trường với thời gian đã điều chỉnh
                return {
                    ...flight.toObject(),
                    departure_date: adjustedDepartureDate.toISOString(),
                    arrival_date: adjustedArrivalDate.toISOString(),
                };
            });

            // Trả về kết quả với các chuyến bay đã được điều chỉnh múi giờ
            res.status(200).json(adjustedFlights);
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
    },

    // searchFlight: async (req, res) => {
    //     const { from, to, departureDate, returnDate, adults, children, infants } = req.query;

    //     // Hàm điều chỉnh thời gian bằng cách trừ một số giờ
    //     const adjustTimeByHours = (date, hours) => {
    //         const adjustedDate = new Date(date);
    //         adjustedDate.setHours(adjustedDate.getHours() - hours);  // Trừ đi số giờ
    //         return adjustedDate;
    //     }

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
    //             return res.json({ message: 'Không có chuyến bay nào vào ngày này' }); // Trả về thông báo thay vì lỗi
    //         }

    //         // Tính tổng giá cho mỗi chuyến bay đi và điều chỉnh thời gian đi
    //         departureFlights = departureFlights.map(flight => {
    //             const totalPrice = (flight.price_adult * parseInt(adults)) +
    //                 (flight.price_child * parseInt(children)) +
    //                 (flight.price_infant * parseInt(infants));

    //             // Điều chỉnh thời gian đi và đến
    //             flight.departure_date = adjustTimeByHours(flight.departure_date, 7);
    //             flight.arrival_date = adjustTimeByHours(flight.arrival_date, 7);

    //             return { ...flight.toObject(), totalPrice };  // Thêm trường totalPrice và thời gian đã điều chỉnh
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
    //                     returnFlights: 'không tìm thấy chuyến bay về'
    //                 });  // Không tìm thấy chuyến bay về, trả về chỉ chuyến bay đi
    //             }

    //             // Tính tổng giá cho mỗi chuyến bay về và điều chỉnh thời gian đi và đến
    //             returnFlights = returnFlights.map(flight => {
    //                 const totalPrice = (flight.price_adult * parseInt(adults)) +
    //                     (flight.price_child * parseInt(children)) +
    //                     (flight.price_infant * parseInt(infants));

    //                 // Điều chỉnh thời gian đi và đến
    //                 flight.departure_date = adjustTimeByHours(flight.departure_date, 7);
    //                 flight.arrival_date = adjustTimeByHours(flight.arrival_date, 7);

    //                 return { ...flight.toObject(), totalPrice };  // Thêm trường totalPrice và thời gian đã điều chỉnh
    //             });

    //             return res.json({ departureFlights, returnFlights });
    //         }

    //         // Trả về chuyến bay một chiều với giá vé và thời gian đã điều chỉnh
    //         res.json({ departureFlights });

    //     } catch (error) {
    //         console.error('Error fetching flights:', error);  // Log lỗi chi tiết
    //         res.status(500).json({ message: 'Error fetching flights', error });
    //     }
    // },

    // API tìm chuyến bay theo flight_number
    getFlightByNumber: async (req, res) => {
        const { query } = req.query;  // Lấy tham số query từ URL

        if (!query) {
            return res.status(400).json({
                error: 'Query parameter is required'
            });
        }

        try {
            const flights = await Flight.find({
                $or: [
                    { flight_number: { $regex: query, $options: 'i' } },  // Tìm theo số chuyến bay
                    { 'departure_airport.code': { $regex: query, $options: 'i' } },  // Tìm theo mã sân bay đi
                    { 'arrival_airport.code': { $regex: query, $options: 'i' } },  // Tìm theo mã sân bay đến
                    { 'airline.name': { $regex: query, $options: 'i' } }  // Tìm theo tên hãng hàng không
                ]
            }).populate('departure_airport')  // Đưa thông tin sân bay đi
                .populate('arrival_airport')    // Đưa thông tin sân bay đến
                .populate('airline')            // Đưa thông tin hãng hàng không
                .limit(10);  // Giới hạn kết quả tìm kiếm

            res.json(flights);
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getFlightsByAirlineIds: async (req, res) => {
        const { airlineIds } = req.query; // Nhận danh sách các airlineId từ query

        if (!airlineIds || airlineIds.length === 0) {
            return res.status(400).json({
                error: 'Airline ID(s) query parameter is required'
            });
        }

        try {
            // Tìm chuyến bay có airline nằm trong danh sách airlineIds
            const flights = await Flight.find({ 'airline': { $in: airlineIds } })
                .populate('departure_airport')
                .populate('arrival_airport')
                .populate('airline');

            if (flights.length === 0) {
                return res.status(404).json({ message: 'Không có chuyến bay nào cho các hãng bay này.' });
            }

            res.status(200).json(flights); // Trả về kết quả chuyến bay
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteFlightById: async (req, res) => {
        try {
            const flightId = req.params.id;

            // Tìm và xóa sân bay
            const deletedFlight = await Flight.findByIdAndDelete(flightId);

            if (!deletedFlight) {
                return res.status(404).json({ message: 'Chuyến bay không tồn tại' });
            }

            res.status(200).json({ message: 'Xóa chuyến bay thành công', data: deletedFlight });
        } catch (error) {
            res.status(500).json({ message: 'Có lỗi xảy ra khi xóa chuyến bay', error: error.message });
        }
    }
}

module.exports = flightsController