import React, { useState, useEffect } from "react";
import user from "../../assets/login-img/user.png"
import * as actions from '../../store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from "axios";
import toast from 'react-toastify'
import axiosConfig from '../../axiosConfig';
import SYSTEM from '../../ultils/constants'

const Login = () => {

    const navigate = useNavigate()
    const { isLoggedIn } = useSelector(state => state.auth)
    const [invalidFields, setInvalidFields] = useState([])
    const [payload, setPayload] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload({
            ...payload,
            [name]: value
        });
    }

    const handleFocus = () => {
        setInvalidFields([])
    }

    useEffect(() => {
        isLoggedIn && navigate('/')
    }, [isLoggedIn, navigate])

    const [authToken, setAuthToken] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form
    
        let invalids = validate(payload); // Kiểm tra tính hợp lệ của các trường
        if (invalids === 0) {
            try {
                console.log('Sending Payload:', payload); // Log payload
                const response = await fetch('http://localhost:5000/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
    
                // Kiểm tra nếu phản hồi từ API là thành công
                if (!response.ok) {
                    throw new Error('Đăng nhập thất bại, vui lòng thử lại.');
                }
    
                const data = await response.json(); // Đảm bảo gọi response.json() một lần
                console.log('Response data:', data); // Log response data
    
                if (data.token) {
                    localStorage.setItem('authToken', data.token); // Lưu token vào localStorage
                    setAuthToken(data.token); // Lưu token vào state
                    // Chuyển hướng sau khi đăng nhập thành công
                    try {
                        navigate('/admin/');
                    } catch (error) {
                        console.error('Navigate error:', error);
                    }
                } else {
                    alert('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
                }
            } catch (error) {
                console.error('Error:', error); // Log chi tiết lỗi
                setError(error.message); // Cập nhật lỗi cho người dùng
                alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } else {
            console.log('Invalid fields:', invalidFields); // In ra các trường không hợp lệ
            setError('Vui lòng kiểm tra lại các trường thông tin.');
        }
    }

    const validate = (payload) => {
        let invalids = 0
        let fields = Object.entries(payload)
        fields.forEach(item => {
            if (item[1] === '') {
                setInvalidFields(prev => [...prev, {
                    name: item[0],
                    message: 'Bạn không được bỏ trống trường này.'
                }])
                invalids++
            }
        })

        fields.forEach(item => {
            switch (item[0]) {
                case 'password':
                    if (item[1].length < 6) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Mật khẩu phải có tối thiểu 6 kí tự.'
                        }])
                        invalids++
                    }
                    break;

                case 'email':
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(item[1])) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Email không hợp lệ.'
                        }]);
                        invalids++;
                    }
                    break

                default:
                    break;
            }
        })
        return invalids
    }

    return (
        <div className="h-[100vh] w-full">
            <div className="h-full w-full relative">
                <div className="absolute w-full h-full bg-login_bg z-20"></div>
                <video className='w-full h-full absolute top-0 left-0 object-cover' autoPlay muted loop src='https://minio.fares.vn/mixivivu-dev/video/Mixivivumaybay.mp4'></video>
            </div>
            <div className="flex flex-col gap-14 items-center absolute top-[400px] left-1/2 px-5 py-10 translate-x-[-50%] translate-y-[-50%] z-30">
                <span className="text-[36px] font-bold text-white">Login</span>
                <form className="flex flex-col gap-6">
                    <div className="relative text-white">
                        <img
                            src={user}
                            alt="user.png"
                            className="absolute top-[18px] left-[22px] cursor-pointer"
                        />
                        <input
                            type="text"
                            name="email"
                            className="outline-none w-[340px] h-[52px] bg-input_bg rounded-[40px] text-[16px] pl-14"
                            placeholder="Nhập email"
                            value={payload.email}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                        {invalidFields.find(field => field.name === 'email') && (
                            <div className="text-red-500 text-sm mt-1 pl-2">
                                {invalidFields.find(field => field.name === 'email').message}
                            </div>
                        )}
                    </div>
                    <div className="relative text-white">
                        <img
                            src={user}
                            alt="user.png"
                            className="absolute top-[18px] left-[22px] cursor-pointer"
                        />
                        <input
                            type="password"
                            name="password"
                            className="outline-none w-[340px] h-[52px] bg-input_bg text-[16px] text-white rounded-[40px] pl-14"
                            placeholder="Nhập mật khẩu"
                            value={payload.password}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                        {invalidFields.find(field => field.name === 'password') && (
                            <div className="text-red-500 text-sm mt-1 pl-2">
                                {invalidFields.find(field => field.name === 'password').message}
                            </div>
                        )}
                    </div>
                    <div>
                        <button type="submit" className="w-[340px] h-[52px] mt-4 bg-primary rounded-[40px] text-primary hover:text-white hover:bg-primary_dark flex items-center justify-center" onClick={handleSubmit}><div>Đăng nhập</div></button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login