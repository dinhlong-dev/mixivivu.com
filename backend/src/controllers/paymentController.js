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
            var ipnUrl = 'https://8964-103-156-46-86.ngrok-free.app/callback'; // Callback URL để nhận kết quả thanh toán
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
        try {
            console.log("Callback received from MoMo:");
            console.log(req.body);

            // Nhận thông tin từ MoMo
            const { partnerCode, orderId, requestId, amount, orderInfo, transId, resultCode, message, signature } = req.body;

            // Kiểm tra chữ ký để xác thực yêu cầu
            const accessKey = 'F8BBA842ECF85';
            const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&payType=qr&requestId=${requestId}&resultCode=${resultCode}&transId=${transId}`;

            // Tạo chữ ký mới để so sánh với chữ ký từ MoMo
            const generatedSignature = crypto
                .createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

            if (signature !== generatedSignature) {
                return res.status(400).json({ msg: 'Invalid signature' });
            }

            let paymentStatus = 'pending';
            let bookingStatus = 'pending';

            // Kiểm tra resultCode và cập nhật trạng thái
            if (resultCode === 0) {
                paymentStatus = 'confirmed'; // Thanh toán thành công
                bookingStatus = 'confirmed'; // Cập nhật trạng thái booking thành confirmed
            } else {
                paymentStatus = 'cancelled'; // Thanh toán thất bại
                bookingStatus = 'cancelled'; // Cập nhật trạng thái booking thành cancelled
            }

            // Cập nhật trạng thái thanh toán trong bảng Payment
            const payment = await Payment.findOneAndUpdate(
                { orderId: orderId },
                { status: paymentStatus }, // Cập nhật trạng thái và transId
                { new: true }
            );

            // Cập nhật trạng thái booking trong bảng Booking
            const booking = await Booking.findOneAndUpdate(
                { _id: payment.bookingId }, // Tìm booking dựa trên bookingId trong bảng Payment
                { status: bookingStatus },  // Cập nhật trạng thái booking
                { new: true }
            );

            // Trả về kết quả cho frontend
            return res.status(200).json({
                status: bookingStatus, 
                message: message,
                payment,
                booking,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                statusCode: 500,
                msg: 'Server error',
            });
        }
    },

    transactionStatus: async (req, res) => {
        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

        const { orderId } = req.body; // Lấy orderId từ request body

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
            if (resultCode === 0) {
                paymentStatus = 'confirmed'; // Thanh toán thành công
            } else {
                paymentStatus = 'cancelled'; // Thanh toán thất bại
            }

            // Cập nhật trạng thái thanh toán trong database
            const payment = await Payment.findOneAndUpdate(
                { orderId: responseOrderId },
                { paymentStatus: paymentStatus },
                { new: true }
            );

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
    }
}

module.exports = Payments