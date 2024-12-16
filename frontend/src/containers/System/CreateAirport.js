import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import path from '../../ultils/constants'
import Header from './Header'
import { createAirport } from './css/createAirport.css'
import { debounce } from 'lodash';

const CreateAirport = () => {

  const [airportQuery, setAirportQuery] = useState('');
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [isOpenCreate, setIsOpenCreate] = useState(false)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (airportQuery.length === 0) {
        setAirportSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/v1/airport?query=${airportQuery}`);
        const data = await response.json();

        // Lọc các sân bay theo tên hoặc mã trùng với query
        const filteredSuggestions = data.filter(airport =>
          airport.name.toLowerCase().includes(airportQuery.toLowerCase()) ||
          airport.code.toLowerCase().includes(airportQuery.toLowerCase())
        );

        setAirportSuggestions(filteredSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [airportQuery]); // Thêm airportQuery vào dependency array


  const handleSuggestionClick = (suggestion, setQuery) => {
    setQuery(`${suggestion.name} (${suggestion.code})`);
    setAirportSuggestions([]);
  };

  const handleButtonOpen = () => {
    setIsOpenCreate(!isOpenCreate)
  }

  // Search 
  const [error, setError] = useState(null);  // Trạng thái lỗi

  // Hàm debounce để trì hoãn gọi API khi gõ input
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Hàm gọi API để lấy tất cả sân bay hoặc tìm kiếm
  const fetchAirports = async (query = '') => {
    if (!query.trim()) {
      try {
        const response = await axios.get('http://localhost:5000/v1/airport/'); // Lấy tất cả sân bay
        setAirports(response.data);  // Cập nhật tất cả sân bay
      } catch (err) {
        setError('Không thể lấy tất cả sân bay. Vui lòng thử lại.');
      }
      return;
    }

    setLoading(true);  // Bắt đầu tải
    setError(null);     // Reset lỗi trước khi tìm kiếm mới

    try {
      const response = await axios.get(`http://localhost:5000/v1/airport/search?query=${query}`);
      if (response.data.length === 0) {
        setError('Không có dữ liệu sân bay');
      }
      setAirports(response.data);  // Cập nhật kết quả tìm kiếm
    } catch (err) {
      setError('Không thể tìm kiếm sân bay. Vui lòng thử lại.');
    } finally {
      setLoading(false);  // Kết thúc quá trình tải
    }
  };

  // Sử dụng debounce cho hàm tìm kiếm khi input thay đổi
  const debouncedFetchAirports = debounce(fetchAirports, 500);

  // Hàm xử lý khi thay đổi input
  const handleInputChange = (e) => {
    setAirportQuery(e.target.value);  // Cập nhật query khi người dùng gõ
  };

  // Gọi hàm tìm kiếm khi `airportQuery` thay đổi
  useEffect(() => {
    if (airportQuery.trim() === '') {
      fetchAirports('');  // Gọi lại API để lấy tất cả sân bay khi input trống
    } else {
      debouncedFetchAirports(airportQuery);  // Gọi API tìm kiếm khi có giá trị
    }
  }, [airportQuery]);

  // Thêm sân bay
  const [airportCode, setAirportCode] = useState('');
  const [airportName, setAirportName] = useState('');
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const [airports, setAirports] = useState([]);  // State để lưu danh sách sân bay
  const [loading, setLoading] = useState(true);  // State để hiển thị trạng thái tải

  const validateForm = () => {
    const newErrors = {};

    if (!airportCode.trim()) newErrors.airportCode = 'Mã sân bay không được để trống.';
    else if (airportCode.length !== 3) newErrors.airportCode = 'Mã sân bay phải có 3 ký tự.';

    if (!airportName.trim()) newErrors.airportName = 'Tên sân bay không được để trống.';

    if (!city.trim()) newErrors.city = 'Thành phố không được để trống.';

    if (!country.trim()) newErrors.country = 'Quốc gia không được để trống.';

    return newErrors;
  };

  const handleButtonSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload trang

    const formErrors = validateForm(); // Gọi hàm validate

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Cập nhật lỗi nếu có
      return;
    }

    setErrors({})

    try {
      const response = await axios.post('http://localhost:5000/v1/airport/add', {
        code: airportCode,
        name: airportName,
        city: city,
        country: country,
      });

      // console.log('response: ', response);

      // Kiểm tra thông báo lỗi từ API
      if (response.data.msg === "Sân bay đã tồn tại với code này." || response.data.msg === "Sân bay đã tồn tại với tên này.") {
        alert(response.data.msg); // Hiển thị cảnh báo nếu trùng code hoặc name
        return;
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      setAirportCode('');
      setAirportName('');
      setCity('');
      setCountry('');

      fetchAirports(); // Cập nhật danh sách sân bay
    } catch (error) {
      console.error('Error adding airport:', error);
      alert('Đã có lỗi xảy ra khi thêm sân bay. Vui lòng thử lại!');
    }
  };

  const handleFocus = () => {
    setErrors([])
  }

  // API hiển thị airport
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/v1/airport/');
        setAirports(response.data);  // Lưu danh sách sân bay vào state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching airports:', error);
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);


  // Hàm xóa sân bay
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/v1/airport/${id}`); // Gọi API xóa sân bay

      // Cập nhật state, loại bỏ sân bay đã xóa
      setAirports(airports.filter(airport => airport._id !== id));

      alert('Xóa sân bay thành công');
    } catch (error) {
      console.error('Lỗi khi xóa sân bay:', error);
      alert('Xóa thất bại');
    }
  }

  // Mở modal và gán dữ liệu sân bay vào form
  const openModal = (airport) => {
    setSelectedAirport(airport);
    setShowModal(true);
  };

  // Hàm sửa sân bay 
  const [selectedAirport, setSelectedAirport] = useState(null); // Lưu sân bay cần sửa
  const [showModal, setShowModal] = useState(false); // Hiển thị modal

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/v1/airport/${selectedAirport._id}`, selectedAirport);
      setAirports(airports.map(airport => airport._id === selectedAirport._id ? selectedAirport : airport));
      setShowModal(false);
      alert('Cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật sân bay:', error);
      alert('Cập nhật thất bại.');
    }
  };

  return (
    <div className='Main'>
      <div className='FlightSearch w-full max-w-[1280px] bg-white px-8 py-4 m-auto'>
        <div className='flex justify-between gap-3 items-center'>
          <div className='flex gap-3'>
            <div className='fill-white stroke-[#475467]'>
              <a href='/admin/dashboard'><svg className='relative top-[-2px] fill-white stroke-[#475467]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 17H16M11.0177 2.76401L4.23539 8.03914C3.78202 8.39176 3.55534 8.56807 3.39203 8.78887C3.24737 8.98446 3.1396 9.2048 3.07403 9.43907C3 9.70353 3 9.99071 3 10.5651V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V10.5651C21 9.99071 21 9.70353 20.926 9.43907C20.8604 9.2048 20.7526 8.98446 20.608 8.78887C20.4447 8.56807 20.218 8.39176 19.7646 8.03914L12.9823 2.76401C12.631 2.49076 12.4553 2.35413 12.2613 2.30162C12.0902 2.25528 11.9098 2.25528 11.7387 2.30162C11.5447 2.35413 11.369 2.49076 11.0177 2.76401Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
            </div>
            <a href='/admin/airport'>
              <div className='flex items-center gap-3'>
                <svg className='w-4 h-4 stroke-[#d0d5dd]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <div className='text-[#475467]'>Quản lý sân bay</div>
              </div>
            </a>
          </div>

          <div className='flex justify-between'>
            <div className=''>
              <label className='InputSearch-Airport mr-3'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <input
                  type='text'
                  placeholder='Nhập tên hoặc mã sân bay'
                  className='outline-none border-none text-[#1d2939] w-full h-6'
                  value={airportQuery}
                  onChange={handleInputChange}
                />
              </label>
              {/* {airportSuggestions.length > 0 && (
                <ul className='suggestions-dropdown suggestions-dropdown_departure'>
                  {airportSuggestions.map((suggestions, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestions, setAirportQuery)}>
                      {suggestions.name} ({suggestions.code})
                    </li>
                  ))}
                </ul>
              )} */}
            </div>
            <button className='bg-primary text-primary cursor-pointer fill-white py-3 px-4 hover:bg-primary_dark hover:text-white'
              // onClick={handleSearch}
            >
              <div className='label md'>Tìm sân bay</div>
            </button>
            <button onClick={handleButtonOpen} className='bg-primary text-primary cursor-pointer fill-white py-3 px-4 ml-10 hover:bg-primary_dark hover:text-white'>
              <div className='label md'>Thêm mới</div>
            </button>
          </div>
        </div>
      </div>

      <div className='Create-airport_container'>
        {isOpenCreate && (
          <div className='max-w-full w-1280 py-20 px-8 m-auto transition-transform'>
            <div>
              <div className="CustomerInfo_customer-info__content__gFjoX">
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4 CustomerInfo_input-group__U1xTl">
                    <div className=" ">
                      <label for=":r1u:" className="InputModal">
                        <input id=":r1u:" className="p-md" placeholder="Nhập code" value={airportCode} onChange={(e) => setAirportCode(e.target.value)} onFocus={handleFocus} />
                        <label for=":r1u:" className="sm ">Code</label>
                      </label>
                      {errors.airportCode && <p className="text-red-500 text-sm mt-1 ml-2">{errors.airportCode}</p>}
                    </div>
                    <div className=" ">
                      <label for=":r1v:" className="InputModal">
                        <input id=":r1v:" className="p-md" placeholder="Nhập tên sân bay" value={airportName} onChange={(e) => setAirportName(e.target.value)} onFocus={handleFocus} />
                        <label for=":r1v:" className="sm ">Tên</label>
                      </label>
                      {errors.airportName && <p className="text-red-500 text-sm mt-1 ml-2">{errors.airportName}</p>}
                    </div>
                    <div className=" ">
                      <label for=":r20:" className="InputModal">
                        <input id=":r20:" className="p-md" placeholder="Nhập thành phố" value={city} onChange={(e) => setCity(e.target.value)} onFocus={handleFocus} />
                        <label for=":r20:" className="sm ">Thành phố</label>
                      </label>
                      {errors.city && <p className="text-red-500 text-sm mt-1 ml-2">{errors.city}</p>}
                    </div>
                    <div className=" ">
                      <label for=":r20:" className="InputModal">
                        <input id=":r20:" className="p-md" placeholder="Nhập quốc gia" value={country} onChange={(e) => setCountry(e.target.value)} onFocus={handleFocus} />
                        <label for=":r20:" className="sm ">Quốc gia</label>
                      </label>
                      {errors.country && <p className="text-red-500 text-sm mt-1 ml-2">{errors.country}</p>}
                    </div>
                  </div>
                  <button onClick={handleButtonSubmit} className='flex justify-center w-1/2 bg-primary text-primary cursor-pointer fill-white py-3 px-4 hover:bg-primary_dark hover:text-white'>
                    <div className='label md'>Thêm</div>
                  </button>
                </div>
                {showToast && (
                  <div className="fixed top-7 z-20 left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded shadow-2xl w-80 text-center">
                    Sân bay đã được thêm thành công!
                    {/* Thanh tiến trình */}
                    <div className="h-1 mt-2 bg-white rounded overflow-hidden">
                      <div className="h-full bg-primary animate-progress"></div>
                    </div>
                  </div>
                )}

                {/* Keyframes cho Tailwind */}
                <style jsx>{`
                  @keyframes progress {
                    from { width: 100%; }
                    to { width: 0; }
                  }
                  .animate-progress {
                    animation: progress 3s linear forwards;
                  }
                `}</style>
              </div>
            </div>
          </div>
        )}

        <div className='max-w-full w-1280 m-auto py-20'>
          <h1 className="text-2xl font-bold mb-4">Danh sách sân bay</h1>
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {airports.length > 0 ? (
                airports.map((airport) => (
                  <div key={airport._id} className="relative">
                    <div className='cart-airport bg-white py-4 px-4'>
                      <div className=''>Code: {airport.code}</div>
                      <div className=''>Name: {airport.name}</div>
                      <div className=''>City: {airport.city}</div>
                      <div className=''>Country: {airport.country}</div>
                    </div>
                    <div className='absolute right-[70px] top-[6px] cursor-pointer hover:underline' onClick={() => openModal(airport)}>Sửa</div>
                    <button className='absolute right-6 top-[6px] cursor-pointer hover:underline' onClick={() => handleDelete(airport._id)}>Xóa</button>
                  </div>
                ))
              ) : (
                <p>Không có dữ liệu sân bay.</p>
              )}
            </div>
          )}
          {showModal && selectedAirport && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white py-5 px-8 rounded-[24px] shadow-lg w-96 flex flex-col gap-4">
                <h2 className="text-xl font-bold mb-4 text-center">Chỉnh sửa sân bay</h2>
                <div className=''>
                  <label className="InputModal">
                    <input
                      type="text"
                      className="p-md w-full outline-none"
                      placeholder="Tên sân bay"
                      value={selectedAirport.code}
                      onChange={(e) => setSelectedAirport({ ...selectedAirport, code: e.target.value })}
                    />
                    <label className="sm">Code</label>
                  </label>
                </div>
                <div className=''>
                  <label className="InputModal">
                    <input
                      type="text"
                      value={selectedAirport.name}
                      onChange={(e) => setSelectedAirport({ ...selectedAirport, name: e.target.value })}
                      className="p-md w-full outline-none"
                      placeholder="Mã sân bay"
                    />
                    <label className="sm">Name</label>
                  </label>
                </div>
                <div className=''>
                  <label className="InputModal">
                    <label className="sm">City</label>
                    <input
                      type="text"
                      value={selectedAirport.city}
                      onChange={(e) => setSelectedAirport({ ...selectedAirport, city: e.target.value })}
                      className="p-md w-full outline-none"
                      placeholder="Thành phố"
                    />
                  </label>
                </div>
                <div className=''>
                  <label className="InputModal">
                    <label className="sm">Country</label>
                    <input
                      type="text"
                      value={selectedAirport.country}
                      onChange={(e) => setSelectedAirport({ ...selectedAirport, country: e.target.value })}
                      className="p-md w-full outline-none"
                      placeholder="Quốc gia"
                    />
                  </label>
                </div>
                <div className='flex justify-between items-center'>
                  <button onClick={handleUpdate} className="bg-primary text-primary px-4 py-2 rounded hover:bg-primary_dark hover:text-white mr-2">
                    Lưu
                  </button>
                  <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateAirport