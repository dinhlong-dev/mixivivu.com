const { Airport, Booking, Flight, Passenger, Payment, User } = require("../models/model");
const axios = require('axios')
const crypto = require('crypto');


const Payments = {
    createPayment: async (req, res) => {
        try {
            const { amount, flight_id, email, phone_number } = req.body; // Nhận thông tin từ frontend

            // Kiểm tra thông tin hợp lệ
            if (!amount || !flight_id || !email || !phone_number) {
                return res.status(400).json({ msg: 'Missing required fields' });
            }

            // Các thông tin về thanh toán
            var accessKey = 'F8BBA842ECF85';
            var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            var orderInfo = `Payment for flight ${flight_id} for customer ${email}`;
            var partnerCode = 'MOMO';
            var redirectUrl = process.env.REDIRECT_URI // Địa chỉ trang sau khi thanh toán
            var ipnUrl = 'https://fe28-171-251-2-210.ngrok-free.app/v1/payment/callback'; // Callback URL để nhận kết quả thanh toán
            var requestType = "payWithMethod";
            var orderId = partnerCode + new Date().getTime();
            var requestId = orderId;  // Mỗi yêu cầu thanh toán sẽ có một ID duy nhất
            var extraData = '';
            var orderGroupId = '';
            var autoCapture = true;
            var lang = 'vi';

            // Chuẩn bị dữ liệu để tạo signature (HMAC SHA256)
            var rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

            console.log("--------------------RAW SIGNATURE----------------");
            console.log(rawSignature);

            // Tạo signature
            var signature = crypto.createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

            console.log("--------------------SIGNATURE----------------");
            console.log(signature);

            // Tạo yêu cầu gửi đến MoMo
            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                partnerName: "Test",
                storeId: "MomoTestStore",
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                lang: lang,
                requestType: requestType,
                autoCapture: autoCapture,
                extraData: extraData,
                orderGroupId: orderGroupId,
                signature: signature
            });

            const options = {
                method: "POST",
                url: "https://test-payment.momo.vn/v2/gateway/api/create",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody)
                },
                data: requestBody
            };

            // Gửi yêu cầu lên MoMo
            let response = await axios(options);

            const newPayment = new Payment({
                orderId: orderId, // Sử dụng orderId trả về từ MoMo
                bookingId: flight_id, // Liên kết với booking
                amount: amount,
                paymentMethod: "MOMO",
                paymentStatus: 'pending' // Trạng thái ban đầu là 'pending'
            });

            const savedPayment = await newPayment.save();

            return res.status(200).json({
                response: response.data,
                savedPayment: savedPayment,
                msg: "Payment initiated successfully"
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                statusCode: 500,
                msg: "Server error"
            });
        }
    },

    paymentCallback: async (req, res) => {
        console.log(req.body);
        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

        const { orderId } = req.body; // Lấy orderId từ request body

        const payment = await Payment.findOne({ orderId });

        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        // Tạo rawSignature từ các tham số nhận được từ MoMo
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: 'MOMO',
            requestId: orderId,
            orderId: orderId,
            signature: signature,
            lang: 'vi',
        });

        // Gửi request đến MoMo để kiểm tra trạng thái giao dịch
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody,
        };

        try {
            // Lấy kết quả từ MoMo
            const result = await axios(options);

            // Lấy thông tin thanh toán từ kết quả trả về
            const { resultCode, message, orderId: responseOrderId } = result.data;

            // Kiểm tra kết quả thanh toán và cập nhật trạng thái
            let paymentStatus = 'pending';
            let bookingStatus = 'pending';

            if (resultCode === 0) {
                paymentStatus = 'confirmed';
                bookingStatus = 'confirmed';
            } else {
                paymentStatus = 'cancelled';
                bookingStatus = 'cancelled';
            }

            // Cập nhật trạng thái thanh toán trong database
            const payment = await Payment.findOneAndUpdate(
                { orderId: responseOrderId },
                { paymentStatus: paymentStatus },
                { new: true }
            );

            if (payment && payment.bookingId) {
                await Booking.findOneAndUpdate(
                    { _id: payment.bookingId },
                    { status: bookingStatus },
                    { new: true }
                );
            }

            // Trả về kết quả cho frontend
            return res.status(200).json({
                status: paymentStatus,
                message: message,
                payment,
            });
        } catch (error) {
            console.error('Error checking transaction status:', error);
            return res.status(500).json({
                statusCode: 500,
                msg: 'Server error',
                error: error.message,
            });
        }
    },

    transactionStatus: async (req, res) => {
        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

        const { orderId } = req.body; // Lấy orderId từ request body

        const payment = await Payment.findOne({ orderId });

        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        // Tạo chữ ký (signature) theo yêu cầu của MoMo
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        // Tạo request body cho MoMo
        const requestBody = JSON.stringify({
            partnerCode: 'MOMO',
            requestId: orderId,
            orderId: orderId,
            signature: signature,
            lang: 'vi',
        });

        // Gửi request đến MoMo để kiểm tra trạng thái giao dịch
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody,
        };

        try {
            // Lấy kết quả từ MoMo
            const result = await axios(options);

            // Lấy thông tin thanh toán từ kết quả trả về
            const { resultCode, message, orderId: responseOrderId } = result.data;

            // Kiểm tra kết quả thanh toán và cập nhật trạng thái
            let paymentStatus = 'pending';
            let bookingStatus = 'pending';

            if (resultCode === 0) {
                paymentStatus = 'confirmed';
                bookingStatus = 'confirmed';
            } else {
                paymentStatus = 'cancelled';
                bookingStatus = 'cancelled';
            }

            // Cập nhật trạng thái thanh toán trong database
            const payment = await Payment.findOneAndUpdate(
                { orderId: responseOrderId },
                { paymentStatus: paymentStatus },
                { new: true }
            );

            if (payment && payment.bookingId) {
                await Booking.findOneAndUpdate(
                    { _id: payment.bookingId },
                    { status: bookingStatus },
                    { new: true }
                );
            }

            // Trả về kết quả cho frontend
            return res.status(200).json({
                status: paymentStatus,
                message: message,
                payment,
            });
        } catch (error) {
            console.error('Error checking transaction status:', error);
            return res.status(500).json({
                statusCode: 500,
                msg: 'Server error',
                error: error.message,
            });
        }
    },

    deletePayment: async (req, res) => {
        try {
            const deletePayment = await Payment.deleteMany()
            res.status(200).json({
                msg: "Delete Compled",
                deletePayment
            })
        } catch (error) {
            res.status(500).json({
                error,
                msg: "loi khi xoa Payment"
            })
        }
    }
}

module.exports = Payments