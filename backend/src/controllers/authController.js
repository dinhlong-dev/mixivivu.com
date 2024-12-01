require('dotenv').config()
const { Airport, Booking, Flight, Passenger, Payment, User } = require("../models/model");
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as authService from '../services/auth'

const authController = {
    // ADD USER
    registerUser: async (req, res) => {
        try {
            const userExists = await User.findOne({ email: req.body.email })

            // Kiểm tra email có tồn tại hay không
            if (userExists) {
                return res.status(400).json({
                    message: "Email này đã được đăng ký",
                });
            }

            // Mã hóa mật khẩu
            const hasdPassWord = await bcryptjs.hash(req.body.password, 10)

            const newUser = new User({ ...req.body, password: hasdPassWord });
            const savedUser = await newUser.save()
            res.status(200).json({
                message: "Thêm user thành công",
                savedUser
            })
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // GET ALL USER
    getAllUser: async (req, res) => {
        try {
            const getUser = await User.find()
            res.status(200).json(getUser)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // DELETE ALL USER 
    deleteAllUser: async (req, res) => {
        try {
            const deleteUser = await User.deleteMany()
            res.status(200).json({
                message: "Xóa tất cả user thành công!"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // LOGIN USER
    loginUser: async (req, res) => {
        try {
            console.log("Email:", req.body.email);
            console.log("Password:", req.body.password);
            const userExists = await User.findOne({ email: req.body.email })
            console.log("User Exists:", userExists);
            // Kiểm tra email có tồn tại hay không
            if (!userExists) {
                return res.status(400).json({
                    message: "Email này chưa được đăng ký",
                });
            }

            // Mã hóa mật khẩu
            const comparePass = await bcryptjs.compare(req.body.password, userExists.password);
            console.log("Password Compare Result:", comparePass);

            if (!comparePass) {
                return res.status(400).json({
                    message: "Mat khau khong dung"
                });
            }

            const token = jwt.sign({ _id: userExists._id, role: userExists.role }, process.env.SECRET_KEY, {
                expiresIn: '7d',
            });

            userExists.password = undefined;

            res.status(201).json({
                message: "Dang nhap thành công",
                token: token || null,
                user: userExists,
            });
        } catch (error) {
            console.error("Error during login:", error);  // Log lỗi để debug
            res.status(500).json({ message: "Lỗi server, vui lòng thử lại", error: error.message });
        }
    },

    getDashboard: async (req, res) => {
        res.json({
            msg: `Chao mung ${req.user._id} den voi dashboard`,
            user: req.user
        })
    }

    // login: async (req, res) => {
    //     const { email, password } = req.body
    //     try {
    //         if (!email || !password) return res.status(400).json({
    //             err: 1,
    //             msg: 'Missing inputs !'
    //         })
    //         const response = await authService.loginService(req.body)
    //         return res.status(200).json(response)

    //     } catch (error) {
    //         return res.status(500).json({
    //             err: -1,
    //             msg: 'Fail at auth controller: ' + error
    //         })
    //     }
    // }
}

module.exports = authController