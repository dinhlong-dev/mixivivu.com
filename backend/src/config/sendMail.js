require('dotenv').config()
const nodemailer = require('nodemailer');

// Hàm gửi email xác nhận
const sendEmail = async ({ email, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail',
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    }

    const result = await transporter.sendMail(message)

    return result
}

module.exports = sendEmail