import React, { useEffect, useState } from 'react'
import axios from 'axios';
import logo from '../../assets/logo.webp';
const booking = require('./css/booking.css');

const Bookings = () => {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/v1/booking/');
                setBookings(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBookings();
    }, []);

    const formatCurrency = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div className='Booking'>
            <div className='w-full max-w-[1280px] px-8 py-4 m-auto'>
                <div className='flex justify-between gap-3 items-center'>
                    <div className='flex gap-3'>
                        <div className='fill-white stroke-[#475467]'>
                            <a href='/admin/dashboard'><svg className='relative top-[-2px] fill-white stroke-[#475467]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 17H16M11.0177 2.76401L4.23539 8.03914C3.78202 8.39176 3.55534 8.56807 3.39203 8.78887C3.24737 8.98446 3.1396 9.2048 3.07403 9.43907C3 9.70353 3 9.99071 3 10.5651V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V10.5651C21 9.99071 21 9.70353 20.926 9.43907C20.8604 9.2048 20.7526 8.98446 20.608 8.78887C20.4447 8.56807 20.218 8.39176 19.7646 8.03914L12.9823 2.76401C12.631 2.49076 12.4553 2.35413 12.2613 2.30162C12.0902 2.25528 11.9098 2.25528 11.7387 2.30162C11.5447 2.35413 11.369 2.49076 11.0177 2.76401Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
                        </div>
                        <a href='/admin/bookings'>
                            <div className='flex items-center gap-3'>
                                <svg className='w-4 h-4 stroke-[#d0d5dd]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                <div className='text-[#475467]'>Đơn đặt vé</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <div className='max-w-full w-[1080px] py-20 px-8 m-auto transition-transform'>
                <div className='grid grid-cols-2 gap-3'>
                    {bookings.map((booking) => (
                        <div key={booking._id} className='cart-statistics flex flex-col items-center gap-10 max-w-[424px] py-8 px-10 max-h-[996px] rounded-[36px] bg-white'>
                            <img
                                alt='mixivivu'
                                src={logo}
                                className='w-60'
                            />
                            <div className='flex flex-col gap-3'>
                                <div className='flex gap-2'>
                                    <label className='md'>Email:</label>
                                    <p className='subheading sm'>{booking.email}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <label className='md'>Số chuyến bay:</label>
                                    <p className='subheading sm'>{booking.flight_id.flight_number}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <label className='md'>Người lớn:</label>
                                    <p className='subheading sm'>{booking.adults}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <label className='md'>Trẻ em:</label>
                                    <p className='subheading sm'>{booking.children}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <label className='md'>Em bé:</label>
                                    <p className='subheading sm'>{booking.infants}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <label className='md'>Tổng tiền:</label>
                                    <p className='subheading sm'>{formatCurrency(booking.total_price.toLocaleString())} VND</p>
                                </div>
                                <div className='flex gap-2'>
                                    <label className='md'>Trạng thái thanh toán</label>
                                    <p className='subheading sm'>{booking.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Bookings