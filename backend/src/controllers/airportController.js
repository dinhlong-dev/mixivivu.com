const { Airport, Booking, Flight, Passenger, Payment, User } = require("../models/model");

const airportController = {
  //ADD AIRPORT
  addAirport: async (req, res) => {
    try {
      const airportsData = req.body; // Nhận dữ liệu từ frontend (mảng sân bay)

      // Kiểm tra dữ liệu đầu vào
      if (!Array.isArray(airportsData) || airportsData.length === 0) {
        return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ' });
      }

      // Thêm nhiều sân bay vào database cùng lúc
      const newAirports = await Airport.insertMany(airportsData);

      res.status(201).json({ message: 'Thêm sân bay thành công', data: newAirports });
    } catch (error) {
      console.error('Lỗi khi thêm sân bay:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi thêm sân bay' });
    }
  },

  addaAirport: async (req, res) => {
    try {
      req.body.code = req.body.code.toUpperCase();

      // Kiểm tra xem có sân bay nào có code trùng không
      const existingAirportByCode = await Airport.findOne({ code: req.body.code });
      
      if (existingAirportByCode) {
        return res.status(200).json({
          msg: "Sân bay đã tồn tại với code này.",
        });
      }

      // Kiểm tra xem có sân bay nào có name trùng không
      const existingAirportByName = await Airport.findOne({ name: req.body.name });
      if (existingAirportByName) {
        return res.status(200).json({
          msg: "Sân bay đã tồn tại với tên này.",
        });
      }

      // Nếu không trùng thì tạo sân bay mới
      const newAirport = new Airport(req.body);
      const savedAirport = await newAirport.save();

      res.status(200).json({
        msg: "Thêm sân bay thành công.",
        savedAirport,
      });
    } catch (error) {
      console.error("Error adding airport:", error);
      res.status(500).json({ msg: "Có lỗi xảy ra khi thêm sân bay." });
    }
  },

  // UPDATE AIRPORT
  updateAirport: async (req, res) => {
    const { id } = req.params;  // Lấy ID từ URL
    const { code, name, city, country } = req.body;  // Lấy thông tin từ body

    // Validate dữ liệu đầu vào
    if (!code || !name || !city || !country) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin sân bay.' });
    }

    try {
      // Tìm và cập nhật sân bay
      const updatedAirport = await Airport.findByIdAndUpdate(
        id,
        { code, name, city, country },  // Thông tin cập nhật
        { new: true, runValidators: true }  // Trả về bản ghi đã cập nhật, chạy validator
      );

      if (!updatedAirport) {
        return res.status(404).json({ message: 'Không tìm thấy sân bay với ID này.' });
      }

      res.status(200).json({ message: 'Cập nhật sân bay thành công!', data: updatedAirport });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật sân bay.', error });
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
  },

  // DELETE AIRPORT
  deleteAirportId: async (req, res) => {
    try {
      const airportId = req.params.id;

      // Tìm và xóa sân bay
      const deletedAirport = await Airport.findByIdAndDelete(airportId);

      if (!deletedAirport) {
        return res.status(404).json({ message: 'Sân bay không tồn tại' });
      }

      res.status(200).json({ message: 'Xóa sân bay thành công', data: deletedAirport });
    } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra khi xóa sân bay', error: error.message });
    }
  }
};

module.exports = airportController;  