require('dotenv').config()
const { Airport, Booking, Flight, Passenger, Payment, User } = require("../models/model");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
// const { getAccessToken } = require('../config/oauth2');
const moment = require('moment-timezone')
const sendEmail = require('../config/sendMail')
const formatDate = require('../function/formatDate')

function formatTime(dateString) {
    const date = new Date(dateString);

    // Lấy giờ và phút
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Định dạng giờ:phút (VD: 09:05)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getDayOfWeek(dateString) {
    const date = new Date(dateString);

    // Mảng các thứ trong tuần
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

    // Lấy chỉ số thứ trong tuần
    const dayOfWeek = date.getDay();

    // Trả về tên thứ
    return days[dayOfWeek];
}

const createBooking = async (req, res) => {
    try {
        const { flight_id, email, adults, children, infants, total_price, phone_number, adultInfo, childInfo, infantInfo } = req.body;

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

        const flights = await Flight.findById(flight_id)
            .populate('departure_airport')   // Lấy thông tin city của departure_airport
            .populate('arrival_airport')
            .populate('airline');
        console.log(flights); // Xem dữ liệu chuyến bay


        const cityDeparture = flights.departure_airport.city;
        const cityArrival = flights.arrival_airport.city;
        const codeDeparture = flights.departure_airport.code;
        const codeArrival = flights.arrival_airport.code;
        const nameDeparture = flights.departure_airport.name;
        const nameArrival = flights.arrival_airport.name;
        const airlineName = flights.airline.name;

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

        await sendEmail({
            email: email,
            subject: 'MixiVivu xác nhận đặt chỗ vé máy bay thành công',
            html: `
                <table style="background:#e6eaed" border="0" width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td align="center">
                                <table style="width:100%;max-width:600px" border="0" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td style="padding-top:24px;padding-bottom:24px" align="center">&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <table style="background:#fff;width:100%;max-width:600px" border="0" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td style="background-image:url('https://ci3.googleusercontent.com/meips/ADKq_Nan8QsiTA5i_uGXh14_hnZVF4kZKaXZ9T5oHQlXGhpHW0C6g2r1iB7I-Wjbk1CU28soLLNwA0IEqyFm68rhS4EOecydMLNce_RhYO-63j1TrD5YwY4IA-BfR-NU3DieAyfk5neTIGOvBQDizGjN7y2ttFcSJN2fTowWxnsxaw0zZB3tF_btfNA=s0-d-e1-ft#https://d1gnmtcb0vp69g.cloudfront.net/imageResource/2021/01/28/1611827920940-d828ad41cd15a98d24597862fd09c177.jpeg') no-repeat;width:100%;height:4px;background-color:#259fd9;display:block">&nbsp;</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:70px" align="left">&nbsp;</td>
                                                            <td align="center" valign="bottom"><img style="padding-top:48px" src="https://ci3.googleusercontent.com/meips/ADKq_NYNNFv5RxVkNGlMrMh8pCS8OqHjYByu_yvLiXmCAPKmB7nAZaemqWD6v-0aIeudfAPFvYiFYZa2anKU-VSG-Mj7vObLn_ekDmu1rxvBKA=s0-d-e1-ft#https://minio.fares.vn/mixivivu-dev/icons/black-logo.png" alt="" class="CToWUd" data-bit="iit"></td>
                                                            <td style="background-image:url('https://ci3.googleusercontent.com/meips/ADKq_NY5Z_-oZ9k4U4HB1OUa2pur7iwI6NhNT8CQjVdLO10sEeLEcyMeg4kZi7Js-3fcZMXeGHdA-jY4ZRK-3KN34pdmQVSBfl_QdtVKTEjVyP5WllJGmdMVH6L1cXYmcaN5oBTOzYbfAXCn9QUDuroolec3C3Zqcvyh6fyvSxcd9NLmvkS6O5L1-A=s0-d-e1-ft#https://d1gnmtcb0vp69g.cloudfront.net/imageResource/2021/01/28/1611827924063-ca8d4d27db0052c2487e6d4ccc87ac35.png')" align="right">&nbsp;</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="background:#fff;padding-left:16px;padding-right:16px" align="center" valign="top" width="100%">
                                                <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="padding-top:24px" align="center" valign="top">
                                                                <h1 style="font-weight:normal;font-size:30px;color:#434343;margin:0px;padding:0px">Quý khách đã đặt giữ chỗ thành công !</h1>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" valign="top">
                                                                <div style="width:100%;height:38px;display:block">&nbsp;</div>
                                                                <h3 style="font-size:16px;margin:0px;padding:0px;color:#d20505"><strong>Quý khách vui lòng kiểm tra kỹ lại các thông tin như: họ và tên, ngày tháng năm sinh, số Căn cước công dân hoặc Hộ chiếu cùng chặng bay, ngày bay, giờ khởi hành và hãng bay trước khi thanh toán.</strong></h3>
                                                                <h3 style="font-size:16px;margin:0px;padding:0px;color:#d20505"><strong>Hệ thống sẽ tự động xuất vé và gửi email sau khi quý khách thanh toán</strong></h3>
                                                                <div style="width:100%;height:16px;display:block">&nbsp;</div>
                                                                <p style="line-height:25px;font-size:16px;padding:0px;margin:0px;color:#434343">EMAIL: <a href="mailto:${email}" target="_blank">${email}</a></p>
                                                                <p style="line-height:25px;font-size:16px;padding:0px;margin:0px;color:#434343">SDT: ${phone_number}</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding-top:30px;padding-bottom:10px" align="left" valign="middle" width="100%;"><span style="font-size:15px;text-transform:uppercase;color:#259fd9;font-weight:bold;margin:0px;padding:0px">Thông tin chuyến bay</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" valign="top">
                                                                <div style="border:1px solid #dadada;border-radius:4px;margin-bottom:16px;padding:8px 16px 16px 16px"><span class="im">
                    <table style="border-bottom:1px solid #dadada;margin-bottom:8px;width:100%" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td style="padding-top:8px;padding-bottom:8px" align="left" valign="top" width="100%">
                                    <table style="display:block;width:200px" border="0" cellspacing="0" cellpadding="0" align="left">
                                        <tbody>
                                            <tr>
                                                <td style="width:100%;padding-bottom:8px" valign="middle"><span style="font-size:12px;color:#8f8f8f;text-transform:uppercase;letter-spacing:0.8px;font-weight:bold">Chuyến bay</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style="display:block;width:290px" border="0" cellspacing="0" cellpadding="0" align="left">
                                        <tbody>
                                            <tr>
                                                <td style="width:100%;padding-bottom:8px" valign="middle"><span style="font-size:12px;color:#434343;text-transform:uppercase;letter-spacing:0.8px;font-weight:bold">${cityDeparture} - ${cityArrival}</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </span><table style="margin-top:5px;display:block" border="0" cellspacing="0" cellpadding="0" align="left">
                        <tbody>
                            <tr>
                                <td style="width:100%" valign="middle">
                                    <table border="0" width="200px" cellspacing="0" cellpadding="0" align="left">
                                        <tbody>
                                            <tr>
                                                <td><span style="font-size:13px;line-height:25px;color:#444444">Mã đặt vé (PNR):</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size:24px;line-height:18px;color:#259fd9;font-weight:bold;padding-top:8px">5V7L7T</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table><span class="im">
                    <table style="margin-top:10px" border="0" width="320px" cellspacing="0" cellpadding="0" align="left">
                        <tbody>
                            <tr>
                                <td><span style="font-size:18px;line-height:22px;color:#444444;font-weight:bold">${formatDate(flight.departure_date)}</span></td>
                            </tr>
                            <tr>
                                <td><span style="font-size:15px;line-height:22px;color:#737374">${formatTime(flight.departure_date)} - ${formatTime(flight.arrival_date)} (${flight.flight_duration}m, Bay thẳng)</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <table border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td valign="top">
                                    <table style="margin-top:10px;display:block;width:200px" border="0" cellspacing="0" cellpadding="0" align="left">
                                        <tbody>
                                            <tr>
                                                <td style="width:100%" valign="middle">
                                                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tbody>
                    <tr>
                        <td style="vertical-align:middle"><img style="width:24px;height:24px" src="https://ci3.googleusercontent.com/meips/ADKq_NYZSxCUzjTA69qWtfHjbH7sFRhKyXDh95XS45ijrHWvCGD8iQpnis6nwWn5gS5TNgqEH4snn93Pt-oeDTOv6KpCDV9eraT87BfCcChMWjawjNcsmMidJ-GiWRBFPUeP6lb5KK-KJCx76QhS986otcP9BOvOuIdC07MWZ_9Z=s0-d-e1-ft#https://minio.fares.vn/mixivivu-dev/icons/icon-email/1611827393518-206370ff769dff23e3454c0a753ce7ee.png" alt="Flight Logo" class="CToWUd" data-bit="iit"></td>
                        <td style="vertical-align:middle"><span style="margin:0px;padding:0px;font-size:15px;color:#444444;font-weight:bold">${airlineName}</span><br><span style="margin:0px;padding:0px;color:#737374;font-size:15px">   </span></td>
                    </tr>
                </tbody>
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style="display:block;margin-top:10px;width:320px" border="0" cellspacing="0" cellpadding="0" align="left">
                                        <tbody>
                                            <tr>
                                                <td style="width:100%;padding-bottom:10px" valign="top">
                                                    <table border="0" width="100%" cellspacing="0" cellpadding="0" align="left">
                                                        <tbody>
                    <tr>
                        <td style="width:55px;padding-bottom:0px" align="left" valign="top">
                            <div style="width:55px;font-size:15px;color:#444444;font-weight:bold">${formatTime(flight.departure_date)}</div>
                            <div style="font-size:15px;color:#737374">${getDayOfWeek(flight.departure_date)}</div>
                        </td>
                        <td style="width:30px" colspan="2" align="left" valign="top"><img style="width:12px;padding:0px 20px" src="https://ci3.googleusercontent.com/meips/ADKq_NZgTqQH0uDqOt0YFZszfAJdTtwCW8OIeKD3WSOJ5ZVrazYDPmI-D_o753mwIEMN-0ItlgPfZdPqZsnkLTk0OaMXsYm_opt71Nvpiie4CbhupEM_DxPts3qYzD61LcckyPQXFTQL_F3a9qoxkE7BJOq1MeEY0jZnlDTKpb8e=s0-d-e1-ft#https://minio.fares.vn/mixivivu-dev/icons/icon-email/1611827927248-80ada129819bd3a0e7e737a3069ff028.png" alt="" class="CToWUd" data-bit="iit">
                            <div style="border-left:1px solid #555;height:50px;margin-left:25px">&nbsp;</div>
                        </td>
                        <td style="padding-bottom:0px" align="left" valign="top"><span style="font-size:15px;color:#444444;font-weight:bold">${cityDeparture} (${codeDeparture})</span><br><span style="font-size:15px;color:#737374">${nameDeparture}</span></td>
                    </tr>
                    <tr>
                        <td style="width:55px;padding-bottom:0px" align="left" valign="top"><span style="font-size:15px;color:#444444;font-weight:bold">${formatTime(flight.arrival_date)}</span> <span style="font-size:15px;color:#737374">${getDayOfWeek(flight.departure_date)}</span></td>
                        <td style="width:30px" colspan="2" align="left" valign="top"><img style="width:12px;padding:0px 20px" src="https://ci3.googleusercontent.com/meips/ADKq_NZgTqQH0uDqOt0YFZszfAJdTtwCW8OIeKD3WSOJ5ZVrazYDPmI-D_o753mwIEMN-0ItlgPfZdPqZsnkLTk0OaMXsYm_opt71Nvpiie4CbhupEM_DxPts3qYzD61LcckyPQXFTQL_F3a9qoxkE7BJOq1MeEY0jZnlDTKpb8e=s0-d-e1-ft#https://minio.fares.vn/mixivivu-dev/icons/icon-email/1611827927248-80ada129819bd3a0e7e737a3069ff028.png" alt="" class="CToWUd" data-bit="iit"></td>
                        <td style="padding-bottom:0px" align="left"><span style="font-size:15px;color:#444444;font-weight:bold">${cityArrival} (${codeArrival})</span><br><span style="font-size:15px;color:#737374">${nameArrival}</span></td>
                    </tr>
                </tbody>
                                                        
                                                        
                                                        
                                                        
                                                        
                                                        
                                                        
                                                        
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </span></div>
                                                                
                                                                <table border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <table border="0" cellspacing="0" cellpadding="0" align="left">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td><span class="im">
                                                                                                <p style="font-size:15px;text-transform:uppercase;color:#259fd9;font-weight:bold">TÊN HÀNH KHÁCH:</p>
                                                                                                <p>1. Ông Le Long ( Người Lớn )</p>
                </span><div style="margin-top:4px;font-family:Arial,sans-serif"><span class="im">
                    
                    <div style="display:flex;margin-bottom:8px">
                        <div style="text-align:left">
                            <div style="padding:4px 8px;background-color:white;border:1px solid #cdd0d1;border-radius:12px;font-size:11px">
                                ${codeDeparture} - ${codeArrival}
                            </div>
                        </div>
                        <div style="margin-left:8px;display:flex">
                            <img src="https://ci3.googleusercontent.com/meips/ADKq_Na_uw4BovqBs1qus7VIqoRpJ5uQhG9UtRGI-oiiE0E0EkcVUIG57jT8k3vRFkbpCadieDb34pfHwl_f-pwTI8pxA7oB2utHYJrk3y50lTUUFNcTgX58lVHePzox9543NSM8D3ldI5mbr82GnaCnodlQ4CkQcGHGXMdABg-Y=s0-d-e1-ft#https://minio.fares.vn/mixivivu-dev/icons/icon-email/1632735564650-6b936f2c40c8e79881f2061606ef7edd.png" style="width:16px;height:16px;margin-right:4px" alt="" class="CToWUd" data-bit="iit">
                            <div style="font-size:14px;color:#687176">0 KG</div>
                        </div>
                    </div>

                    
                    </span><div style="display:flex;margin-bottom:8px">
                        <div style="min-width:150px;text-align:left">
                            <div style="padding:4px 8px;background-color:white;font-size:11px">Căn cước công dân:</div>
                        </div>
                        <div style="font-size:14px;color:#687176">11111</div>
                    </div><span class="im">

                    
                    <div style="display:flex;margin-bottom:8px">
                        <div style="min-width:150px;text-align:left">
                            <div style="padding:4px 8px;background-color:white;font-size:11px">Ngày hết hạn CCCD:</div>
                        </div>
                        <div style="font-size:14px;color:#687176">12/12/2030</div>
                    </div>

                    
                    </span><div style="display:flex;margin-bottom:8px">
                        <div style="min-width:150px;text-align:left">
                            <div style="padding:4px 8px;background-color:white;font-size:11px">Ngày sinh:</div>
                        </div>
                        <div style="font-size:14px;color:#687176">16/12/2003</div>
                    </div>
                </div>    
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td><br></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                                <table style="border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#dadada" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td><br><br></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                                
                                                                                <table style="border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#dadada" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td><br><br></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                                <table style="width:100%;height:16px" border="0" cellspacing="0" cellpadding="0" align="center">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td>&nbsp;</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                                <table border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td style="border-right-width:1px;border-right-style:solid;border-right-color:#dadada" valign="top">
                                                                                                <p style="float:left;margin:0px;padding:0px"><span style="font-size:11px">Quý khách cần hỗ trợ</span><br><span style="font-size:15px;font-weight:bold">0922222016</span><br><span style="font-size:15px;font-weight:bold"><a href="mailto:info@mixivivu.com" target="_blank">info@mixivivu.com</a></span></p>
                                                                                            </td>
                                                                                            <td style="padding-left:15px" valign="top">
                                                                                                <p style="float:left;width:180px;margin:0px;padding:0px"><span style="font-size:11px">Mã đặt chỗ mixivivu</span><br><span style="font-size:15px;font-weight:bold">mixiflight2412000098</span></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table style="margin-top:16px" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style="width:100%;background:#444444;height:0px">&nbsp;</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="background-color:#e6eaed">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="background-color:#e6eaed">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="background-color:#e6eaed">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="background-color:#e6eaed">
                                                <table style="margin:0 auto;border-collapse:collapse;border-spacing:0;float:none;padding:0;text-align:center;vertical-align:top;width:100%">
                                                    <tbody>
                                                        <tr style="padding:0;text-align:left;vertical-align:top">
                                                            <td style="margin:0;border-collapse:collapse!important;color:#434343;font-size:16px;font-weight:normal;line-height:16px;padding:0;text-align:left;vertical-align:top;word-wrap:break-word" height="16px">&nbsp;</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `
        })

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
