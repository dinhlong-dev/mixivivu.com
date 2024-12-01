const { Airport, Booking, Flight, Passenger, Payment, User, AirLine } = require("../models/model");

const airlineController = {
    // ADD AIRLINE
    addAirline: async (req, res) => {
        const { code, name } = req.body;

        // Kiểm tra xem có hãng bay nào trùng mã hoặc tên không
        const existingAirlineByCode = await Airport.findOne({ code: req.body.code });

        if (existingAirlineByCode) {
            return res.status(200).json({
                msg: "Hãng bay đã tồn tại với code này.",
            });
        }

        // Kiểm tra xem có sân bay nào có name trùng không
        const existingAirlineByName = await Airport.findOne({ name: req.body.name });
        if (existingAirlineByName) {
            return res.status(200).json({
                msg: "Hãng bay đã tồn tại với tên này.",
            });
        }

        // Tạo hãng bay mới nếu không trùng
        const newAirline = new AirLine({ code, name });

        try {
            // Lưu hãng bay vào database
            const savedAirline = await newAirline.save();
            res.status(200).json(savedAirline);
        } catch (error) {
            res.status(500).json(error);
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
    },

    // DELETE A AIRLINE
    deleteAirline: async (req, res) => {
        const { id } = req.params; // Lấy id từ URL

        try {
            // Tìm hãng bay theo id và xóa
            const airline = await AirLine.findByIdAndDelete(id);

            if (!airline) {
                return res.status(404).json({ message: 'Hãng bay không tồn tại.' });
            }

            res.status(200).json({ message: 'Hãng bay đã được xóa thành công.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa hãng bay.' });
        }
    },

    // UPDATE AIRLINE
    updateAirline: async (req, res) => {
        const { id } = req.params; // Lấy id từ URL
        const { code, name } = req.body; // Lấy thông tin cần sửa từ body

        try {
            // Tìm hãng bay theo ID
            const airline = await AirLine.findById(id);

            if (!airline) {
                return res.status(404).json({ message: 'Hãng bay không tồn tại.' });
            }

            // Kiểm tra xem mã hoặc tên có bị trùng không trước khi cập nhật
            const existingAirline = await AirLine.findOne({
                $or: [{ code }, { name }],
                _id: { $ne: id } // Đảm bảo rằng không tìm thấy hãng bay trùng với id hiện tại
            });

            if (existingAirline) {
                return res.status(400).json({ message: 'Code hoặc name bị trùng!' });
            }

            // Cập nhật thông tin hãng bay
            airline.code = code || airline.code;
            airline.name = name || airline.name;

            const updatedAirline = await airline.save(); // Lưu lại hãng bay đã cập nhật

            res.status(200).json(updatedAirline); // Trả về hãng bay đã sửa
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi sửa hãng bay.' });
        }
    },

    searchAirline: async (req, res) => {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                error: 'Query parameter is required'
            });
        }
        try {
            const airlines = await AirLine.find({
                $or: [
                    { code: { $regex: query, $options: 'i' } },
                    { name: { $regex: query, $options: 'i' } }
                ]
            }).limit(10); // Giới hạn kết quả tìm kiếm 
            res.json(airlines);
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}

module.exports = airlineController