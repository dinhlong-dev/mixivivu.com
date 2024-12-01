import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { path } from '../../ultils/constants'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import CreateAirport from './CreateAirport'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';


const System = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      // Nếu không có token, điều hướng về trang login
      navigate('/login');  // Điều hướng đến trang login
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.role === 'admin') {
        setIsAuthenticated(true);
      } else {
        // Nếu role không phải admin, điều hướng về trang login
        navigate('/login'); // Điều hướng đến trang login nếu không phải admin
      }
    } catch (error) {
      console.error("Token không hợp lệ hoặc hết hạn", error);
      navigate('/login'); // Điều hướng về login nếu token không hợp lệ
    }
  }, [navigate]); // Chỉ chạy lại useEffect nếu navigate thay đổi

  if (!isAuthenticated) {
    // Điều hướng ngay lập tức nếu chưa xác thực
    return null;
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default System