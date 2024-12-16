require('dotenv').config()
const { Airport, Booking, Flight, Passenger, Payment, User } = require("../models/model");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
// const { getAccessToken } = require('../config/oauth2');
const moment = require('moment-timezone')

// Hàm lấy access_token từ refresh_token
const getAccessToken = async () => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI_DEV
    );
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const token = await oauth2Client.getAccessToken();
    return token.token;
};

// Hàm gửi email xác nhận
const sendBookingConfirmationEmail = async (email, bookingDetails) => {
    try {
        const accessToken = await getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Xác nhận đặt vé máy bay",
            text: `Cảm ơn bạn đã đặt vé!\n\nThông tin đặt vé:\n- Mã chuyến bay: ${bookingDetails.flightId}\n- Ngày đặt: ${bookingDetails.bookingDate}\n- Trạng thái: ${bookingDetails.status}\n\nChúc bạn có chuyến đi vui vẻ!`,
        };

        console.log("Đang gửi email...");
        await transporter.sendMail(mailOptions);
        console.log("Email đã được gửi thành công!");
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
    }
};

const createBooking = async (req, res) => {
    try {
        const { flight_id, email, adults, children, infants, total_price } = req.body;

        const totalSeats = adults + children + infants;

        // 1. Kiểm tra thông tin chuyến bay
        const flight = await Flight.findById(flight_id);
        if (!flight) {
            return res.status(404).json({ message: "Chuyến bay không tồn tại." });
        }

        // Kiểm tra xem có đủ ghế không
        if (flight.available_seats < totalSeats) {
            return res.status(400).json({ msg: "Not enough available seats" });
        }

        // Tiến hành trừ đi số ghế đã đặt
        flight.available_seats -= totalSeats;

        // Lưu thông tin chuyến bay đã cập nhật lại
        await flight.save();

        if (!email) {
            return res.status(400).json({ message: "Email là bắt buộc." });
        }

        const now = new Date();
        const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

        const nowInGMT7 = moment().tz('Asia/Ho_Chi_Minh').toDate();
        // 2. Tạo thông tin đặt vé
        const newBooking = new Booking({
            email: email,
            flight_id: flight_id,
            adults: adults,
            children: children,
            infants: infants,
            total_price: total_price,
            booking_date: vietnamTime,
            status: "pending",
        });

        // 3. Lưu thông tin đặt vé vào cơ sở dữ liệu
        const booking = await newBooking.save();

        // 4. Gửi email xác nhận
        await sendBookingConfirmationEmail(email, {
            flightId: flight_id,
            bookingDate: newBooking.booking_date,
            status: newBooking.status,
        });

        // 5. Phản hồi thành công
        return res.status(201).json({
            message: "Đặt vé thành công. Email xác nhận đã được gửi.",
            booking: booking,
            // bookingId: booking._id,
        });
    } catch (error) {
        console.error("Lỗi khi thêm đặt vé:", error);
        return res.status(500).json({ message: "Đã xảy ra lỗi hệ thống." });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const deleteBooking = await Booking.deleteMany()
        res.status(200).json({
            msg: "Delete Compled"
        })
    } catch (error) {
        res.status(500).json({
            error,
            msg: "loi khi xoa booking"
        })
    }
}

const getBookingStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Nếu không có tham số, sử dụng ngày đầu và ngày cuối của tháng hiện tại
        const startOfMonth = startDate ? new Date(startDate) : moment().startOf('month').toDate();
        const endOfMonth = endDate ? new Date(endDate) : moment().endOf('month').toDate();

        // Truy vấn để lấy tất cả bookings trong tháng hiện tại
        const bookings = await Booking.find({
            booking_date: { $gte: startOfMonth, $lte: endOfMonth },
            status: 'confirmed',
        });

        const uniqueAccounts = await User.countDocuments();

        // if (bookings.length === 0) {
        //     return res.json({
        //         totalTickets: 0,
        //         totalAmount: 0,
        //         message: "Không có booking nào trong tháng này.",
        //     });
        // }

        // Tính tổng số vé và tổng tiền
        let totalTickets = 0;
        let totalAmount = 0;
        let totalBookings = bookings.length;

        bookings.forEach(booking => {
            totalTickets += (booking.adults || 0) + (booking.children || 0) + (booking.infants || 0); // Tổng số vé
            totalAmount += booking.total_price || 0; // Tổng số tiền
        });

        // Trả về kết quả thống kê
        res.json({
            totalTickets,
            totalAmount,
            uniqueAccounts,
            totalBookings,
            message: "Thống kê thành công!",
        });
    } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thống kê" });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('flight_id', 'flight_number')
        res.status(200).json(bookings)
    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = { createBooking, deleteBooking, getBookingStats, getAllBookings };
