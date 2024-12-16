import React from 'react'
import { flight } from './css/flights.css'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker';
import vi from 'date-fns/locale/vi'
import customViLocale from "../System/custom/customViLocale"
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const FlightManager = () => {
    const [departureQuery, setDepartureQuery] = useState('')
    const [arrivalQuery, setArrivalQuery] = useState('')
    const [departureSuggestions, setDepartureSuggestions] = useState([]);
    const [arrivalSuggestions, setArrivalSuggestions] = useState([]);
    const [isOpenCreateFlight, setisOpenCreateFlight] = useState(false)
    const [errors, setErrors] = useState('')
    const [flightData, setFlightData] = useState({
        flight_number: '',
        arrival_airport: '',
        departure_airport: '',
        departure_date: new Date(),
        departure_time: '',
        arrival_date: new Date(),
        arrival_time: '',
        price_adult: '',
        price_child: '',
        price_infant: '',
        available_seats: '',
        airline: '',
        seat_class: 'Economy',
        carry_on_baggage: '17kg',
        checked_baggage: '20kg',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlightData({ ...flightData, [name]: value });
    };

    const datePickerRef = useRef(null);
    const datePickerRefArival = useRef(null);
    const [departureDate, setDepartureDate] = useState(new Date());
    const [arrivalDate, setArrivalDate] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState(null);

    const handleDepartureDateChange = (date) => {
        setDepartureDate(date);
        if (datePickerRef.current) {
            datePickerRef.current.setOpen(false);
        }
        console.log(flightData.departure_date);

    };

    const handleArrivalDateChange = (date) => {
        setArrivalDate(date);
        if (datePickerRefArival.current) {
            datePickerRefArival.current.setOpen(false);
        }
        console.log(flightData.arrival_date);
    };

    const handleOpenForm = () => {
        setisOpenCreateFlight(!isOpenCreateFlight)
    }

    useEffect(() => {
        const fetchSuggestions = async (query, setSuggestions) => {
            if (query.length === 0) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/v1/airport?query=${query}`);
                const data = await response.json();

                // Lọc các sân bay theo tên hoặc mã trùng với query
                const filteredSuggestions = data.filter(airport =>
                    airport.name.toLowerCase().includes(query.toLowerCase()) ||
                    airport.code.toLowerCase().includes(query.toLowerCase())
                );

                setSuggestions(filteredSuggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        fetchSuggestions(departureQuery, setDepartureSuggestions);
    }, [departureQuery]);

    useEffect(() => {
        const fetchSuggestions = async (query, setSuggestionsArrival) => {
            if (query.length === 0) {
                setSuggestionsArrival([]);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/v1/airport?query=${query}`);
                const data = await response.json();

                // Lọc các sân bay theo tên hoặc mã trùng với query
                const filteredSuggestions = data.filter(airport =>
                    airport.name.toLowerCase().includes(query.toLowerCase()) ||
                    airport.code.toLowerCase().includes(query.toLowerCase())
                );

                setSuggestionsArrival(filteredSuggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        fetchSuggestions(arrivalQuery, setArrivalSuggestions);
    }, [arrivalQuery]);

    const handleSuggestionClick = (suggestion, setQuery, setFlightData, setSuggestions, type) => {
        setQuery(`${suggestion.name} (${suggestion.code})`); // Cập nhật giá trị hiển thị cho input
        setFlightData((prev) => ({
            ...prev,
            [type]: suggestion._id, // Cập nhật ID sân bay vào flightData (dùng type để xác định điểm đi hay điểm đến)
        }));
        setSuggestions([]); // Dọn dẹp gợi ý sau khi chọn
    };



    const [airlines, setAirlines] = useState([]);  // Danh sách các hãng hàng không
    const [flights, setFlights] = useState([]);  // Danh sách các hãng hàng không
    const [flightNumber, setFlightNumber] = useState('');  // Mã chuyến bay
    const [selectedAirline, setSelectedAirline] = useState('');  // Airline đã chọn
    const [loading, setLoading] = useState(true)

    // Tải danh sách hãng hàng không khi component mount
    useEffect(() => {
        const fetchAirlines = async () => {
            try {
                const response = await axios.get('http://localhost:5000/v1/airline/');
                setAirlines(response.data);  // Giả sử API trả về mảng các hãng hàng không
            } catch (error) {
                console.error("Error fetching airlines:", error);
            }
        };

        fetchAirlines();
    }, []);

    const handleAirlineChange = (e) => {
        const selectedAirlineId = e.target.value; // Lấy ID hãng bay
        const selectedAirline = airlines.find(airline => airline._id === selectedAirlineId); // Tìm hãng bay từ danh sách airlines

        setFlightData((prevState) => ({
            ...prevState,
            airline: selectedAirlineId, // Lưu ID hãng bay vào flightData
            flight_number: selectedAirline.code  // Gán mã hãng bay vào flight_number
        }));
        setSelectedAirline(selectedAirlineId); // Cập nhật giá trị selectedAirline
    };


    const handleFlightNumberChange = (e) => {
        const value = e.target.value;
        setFlightData((prevState) => ({
            ...prevState,
            flight_number: value, // Cập nhật flight_number trong flightData
        }));
        setFlightNumber(value); // Nếu bạn muốn lưu trong state riêng của flightNumber
    };

    const [error, setError] = useState('')

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await axios.get('http://localhost:5000/v1/flight/');
                setFlights(response.data);
                setLoading(false);
            } catch (err) {
                setError('Lỗi khi tải dữ liệu chuyến bay!');
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await axios.get('http://localhost:5000/v1/flight/');
            setFlights(response.data);
            setLoading(false);
        } catch (err) {
            setError('Lỗi khi tải dữ liệu chuyến bay!');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Departure Date:', flightData.departure_date);
        console.log('Departure Time:', flightData.departure_time);
        console.log('Arrival Date:', flightData.arrival_date);
        console.log('Arrival Time:', flightData.arrival_time);

        try {
            const date = await axios.get('http://localhost:5000/v1/flight/');
            const existingFlights = date.data;

            // Kiểm tra xem số chuyến bay đã tồn tại trong danh sách
            const isFlightNumberExist = existingFlights.some(flight => flight.flight_number === flightData.flight_number);
            if (isFlightNumberExist) {
                alert('Chuyến bay đã tồn tại!');
                return; // Dừng quá trình nếu số chuyến bay đã tồn tại
            }

            const departureDateString = flightData.departure_date.toISOString().split('T')[0]; // Lấy phần ngày
            const arrivalDateString = flightData.arrival_date.toISOString().split('T')[0]; // Lấy phần ngày

            // Tạo chuỗi thời gian hoàn chỉnh cho Departure và Arrival
            const departureTimeString = `${departureDateString}T${flightData.departure_time}:00`;
            const arrivalTimeString = `${arrivalDateString}T${flightData.arrival_time}:00`;

            // Tạo đối tượng Date từ chuỗi thời gian
            const departureDateTime = new Date(departureTimeString);
            const arrivalDateTime = new Date(arrivalTimeString);

            // Điều chỉnh múi giờ bằng cách cộng thêm 7 giờ (7 * 60 * 60 * 1000 ms)
            const OFFSET_MS = 7 * 60 * 60 * 1000;

            const departureDateTimeWithOffset = new Date(departureDateTime.getTime() + OFFSET_MS);
            const arrivalDateTimeWithOffset = new Date(arrivalDateTime.getTime() + OFFSET_MS);

            // Kiểm tra tính hợp lệ của thời gian
            if (isNaN(departureDateTimeWithOffset.getTime()) || isNaN(arrivalDateTimeWithOffset.getTime())) {
                alert('Ngày hoặc giờ không hợp lệ!');
                return;
            }

            console.log(flightData);

            // Tính tổng phút bay
            const flightDuration = Math.floor((arrivalDateTime - departureDateTime) / (1000 * 60));

            if (flightDuration <= 0) {
                alert('Thời gian đến phải lớn hơn thời gian đi!');
                return;
            }

            if (flightDuration <= 0) {
                alert('Thời gian bay không hợp lệ!');
                return;
            }

            const { departure_time, arrival_time, ...formattedData } = flightData;

            // Chuẩn bị dữ liệu để gửi API
            const sendData = {
                ...formattedData,
                flight_duration: flightDuration,
                departure_date: departureDateTimeWithOffset.toISOString(),
                arrival_date: arrivalDateTimeWithOffset.toISOString(),
            };

            console.log(sendData);

            const response = await axios.post('http://localhost:5000/v1/flight/', sendData);
            alert('Thêm chuyến bay thành công!');
            console.log(response.data);

        } catch (error) {
            console.error('Lỗi khi thêm chuyến bay:', error);
            alert('Thêm chuyến bay thất bại!');
        }
        fetchFlights()
    };

    const formatCurrency = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const [query, setQuery] = useState(''); // Lưu từ khóa tìm kiếm

    // Hàm tìm kiếm chuyến bay khi query thay đổi
    const fetchFlightss = async (searchQuery) => {
        if (!searchQuery.trim()) {
            const response = await axios.get('http://localhost:5000/v1/flight/');
            setFlights(response.data);
            setLoading(false);
        }

        setLoading(true);  // Đặt trạng thái loading
        setError(null);     // Reset lỗi trước khi tìm kiếm mới

        try {
            // Gửi yêu cầu GET tới API để tìm kiếm chuyến bay
            const response = await axios.get(`http://localhost:5000/v1/flight/search-by-number?query=${searchQuery}`);
            if (response.data.length === 0) {
                setError('Không có chuyến bay nào phù hợp.');
            }
            setFlights(response.data);  // Cập nhật kết quả tìm kiếm
        } catch (err) {
            setError('Không thể tìm kiếm chuyến bay. Vui lòng thử lại.');
        } finally {
            setLoading(false);  // Kết thúc quá trình tải
        }
    };

    // Gọi hàm tìm kiếm mỗi khi query thay đổi
    useEffect(() => {
        fetchFlightss(query);
    }, [query]);

    const [selectedAirlines, setSelectedAirlines] = useState([]);

    // useEffect(() => {
    //     const fetchAirlines = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/v1/airline/');
    //             setAirlines(response.data); // Giả sử API trả về danh sách các hãng bay
    //         } catch (err) {
    //             setError('Không thể lấy danh sách hãng bay');
    //         }
    //     };

    //     fetchAirlines();
    // }, []);

    // Lọc chuyến bay dựa trên các hãng bay đã chọn
    const fetchFlightsByAirlines = async () => {
        if (selectedAirlines.length === 0) {
            const response = await axios.get('http://localhost:5000/v1/flight/');
            setFlights(response.data);
            setLoading(false);
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://localhost:5000/v1/flight/airlines', {
                params: {
                    airlineIds: selectedAirlines
                }
            });
            setFlights(response.data);
        } catch (err) {
            setError('Không thể tìm kiếm chuyến bay. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi người dùng chọn/deselect một hãng bay
    const handleCheckboxChange = (event) => {
        const airlineId = event.target.value;

        if (event.target.checked) {
            setSelectedAirlines(prevState => [...prevState, airlineId]);
        } else {
            setSelectedAirlines(prevState => prevState.filter(id => id !== airlineId));
        }
    };

    // Gọi hàm lọc chuyến bay khi danh sách hãng bay được thay đổi
    useEffect(() => {
        fetchFlightsByAirlines();
    }, [selectedAirlines]);

    return (
        <div>
            <div className='w-full max-w-[1280px] px-8 py-4 bg-white m-auto'>
                <div className='flex justify-between gap-3 items-center'>
                    <div className='flex gap-3'>
                        <div className='fill-white stroke-[#475467]'>
                            <a href='/admin'><svg className='relative top-[-2px] fill-white stroke-[#475467]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 17H16M11.0177 2.76401L4.23539 8.03914C3.78202 8.39176 3.55534 8.56807 3.39203 8.78887C3.24737 8.98446 3.1396 9.2048 3.07403 9.43907C3 9.70353 3 9.99071 3 10.5651V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V10.5651C21 9.99071 21 9.70353 20.926 9.43907C20.8604 9.2048 20.7526 8.98446 20.608 8.78887C20.4447 8.56807 20.218 8.39176 19.7646 8.03914L12.9823 2.76401C12.631 2.49076 12.4553 2.35413 12.2613 2.30162C12.0902 2.25528 11.9098 2.25528 11.7387 2.30162C11.5447 2.35413 11.369 2.49076 11.0177 2.76401Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
                        </div>
                        <a href='/admin/flight'>
                            <div className='flex items-center gap-3'>
                                <svg className='w-4 h-4 stroke-[#d0d5dd]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                <div className='text-[#475467]'>Quản lý chuyến bay</div>
                            </div>
                        </a>
                    </div>

                    <div className='flex justify-between'>
                        <div className=''>
                            <label className='InputSearch-Airport mr-3'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                <input
                                    type='text'
                                    placeholder='Nhập số chuyến bay'
                                    className='outline-none border-none text-[#1d2939] h-6'
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </label>
                        </div>
                        <button
                            className='bg-primary text-primary cursor-pointer fill-white py-3 px-4 hover:bg-primary_dark hover:text-white'
                        // onClick={handleSearch}
                        >
                            <div className='label md'>Tìm hãng bay</div>
                        </button>
                        <button
                            className='bg-primary text-primary cursor-pointer fill-white py-3 px-4 ml-10 hover:bg-primary_dark hover:text-white'
                            onClick={handleOpenForm}
                        >
                            <div className='label md'>Thêm mới</div>
                        </button>
                    </div>
                </div>

            </div>
            <div className='FlightManagement'>
                {isOpenCreateFlight && (
                    <div className='max-w-full w-1280 py-20 px-8 m-auto'>
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-4 gap-4 CustomerInfo_input-group__U1xTl">
                                <div className=" ">
                                    <select className='InputModal w-full outline-none' id="airline" value={selectedAirline} onChange={handleAirlineChange}>
                                        <option value={flightData.airline}>Chọn hãng bay</option>
                                        {airlines.map((airline) => (
                                            <option key={airline._id} value={airline._id}>
                                                {airline.name} ({airline.code})
                                            </option>
                                        ))}
                                        <label htmlFor="airline">Airline:</label>
                                    </select>
                                </div>
                                <div className=" ">
                                    <label for=":r1u:" className="InputModal">
                                        <input
                                            id="flight_number"
                                            className="p-md w-full"
                                            placeholder="Nhập code"
                                            value={flightData.flight_number}
                                            onChange={handleFlightNumberChange}
                                        />
                                        <label for=":r1u:" className="sm ">Số chuyến bay</label>
                                    </label>
                                    {errors.airlineCode && <p className="text-red-500 text-sm mt-1 ml-2">{errors.airlineCode}</p>}
                                </div>
                                <div className=" ">
                                    <label for=":r1v:" className="InputModal">
                                        <input id=":r1v:" className="p-md w-full" placeholder="Nhập tên sân bay" value={departureQuery} onChange={(e) => setDepartureQuery(e.target.value)} />
                                        <label for=":r1v:" className="sm ">Điểm đi</label>
                                    </label>
                                    {departureSuggestions.length > 0 && (
                                        <ul className='suggestions-dropdown suggestions-dropdown_departure'>
                                            {departureSuggestions.map((suggestions, index) => (
                                                <li key={index} onClick={() => handleSuggestionClick(suggestions, setDepartureQuery, setFlightData, setDepartureSuggestions, 'departure_airport')}>
                                                    {suggestions.name} ({suggestions.code})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className=" ">
                                    <label for=":r1v:" className="InputModal">
                                        <input id=":r1v:" className="p-md w-full" placeholder="Nhập tên sân bay" value={arrivalQuery} onChange={(e) => setArrivalQuery(e.target.value)} />
                                        <label for=":r1v:" className="sm ">Điểm đến</label>
                                    </label>
                                    {arrivalSuggestions.length > 0 && (
                                        <ul className='suggestions-dropdown suggestions-dropdown_departure'>
                                            {arrivalSuggestions.map((suggestions, index) => (
                                                <li key={index} onClick={() => handleSuggestionClick(suggestions, setArrivalQuery, setFlightData, setArrivalSuggestions, "arrival_airport")}>
                                                    {suggestions.name} ({suggestions.code})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className=" ">
                                    <label className='InputModal'>
                                        <svg className='relative' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path className='stroke-[#98a2b3]' d="M3 9H21M7 3V5M17 3V5M6 12H10V16H6V12ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        <label className="absolute top-[-12px] left-6 text-ab_text text-fz_14 ">Ngày đi</label>
                                        <DatePicker
                                            ref={datePickerRef}
                                            selected={departureDate}
                                            onChange={handleDepartureDateChange}
                                            minDate={new Date()}
                                            // shouldCloseOnSelect={true}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi-custom"
                                            customInput={
                                                <input
                                                    type='text'
                                                    className="rounded-[28px] outline-none w-full custom-date-input text-slate-700"
                                                    value={flightData.departure_date ? flightData.departure_date.toLocaleDateString() : `${currentDateTime.toLocaleDateString()}`}
                                                    readOnly
                                                />
                                            }
                                        />
                                    </label>
                                </div>
                                <div className=" ">
                                    <label className='InputModal'>
                                        <input
                                            className='rounded-[28px] outline-none w-full custom-date-input text-slate-700'
                                            type="time"
                                            name="departure_time"
                                            value={flightData.departure_time}
                                            onChange={handleChange}
                                        />
                                        <label className='sm'>Giờ đi</label>
                                    </label>
                                </div>
                                <div className=" ">
                                    <label className='InputModal'>
                                        <svg className='relative' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path className='stroke-[#98a2b3]' d="M3 9H21M7 3V5M17 3V5M6 12H10V16H6V12ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        <label className="absolute top-[-12px] left-6 text-ab_text text-fz_14 ">Ngày đến</label>
                                        <DatePicker
                                            ref={datePickerRef}
                                            selected={arrivalDate}
                                            onChange={handleArrivalDateChange}
                                            minDate={new Date()}
                                            // shouldCloseOnSelect={true}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi-custom"
                                            customInput={
                                                <input
                                                    type='text'
                                                    className="rounded-[28px] outline-none w-full custom-date-input text-slate-700"
                                                    value={flightData.arrival_date ? flightData.arrival_date.toLocaleDateString() : `${currentDateTime.toLocaleDateString()}`}
                                                    readOnly
                                                />
                                            }
                                        />
                                    </label>
                                </div>
                                <div className=" ">
                                    <label className='InputModal'>
                                        <input
                                            className='rounded-[28px] outline-none w-full custom-date-input text-slate-700'
                                            type="time"
                                            name="arrival_time"
                                            value={flightData.arrival_time}
                                            onChange={handleChange}
                                        />
                                        <label className='sm'>Giờ đến</label>
                                    </label>
                                </div>
                                <div className=" ">
                                    <label className='InputModal'>
                                        <input
                                            className='rounded-[28px] outline-none w-full h-full custom-date-input text-slate-700'
                                            type="number"
                                            min="1"
                                            name="available_seats"
                                            value={flightData.available_seats || 1}
                                            onChange={handleChange}
                                        />
                                        <label className='sm'>Số ghế</label>
                                    </label>
                                </div>
                                <div className=" ">
                                    <label className='InputModal'>
                                        <input
                                            className='rounded-[28px] outline-none w-full custom-date-input text-slate-700'
                                            type="text"
                                            name="price_adult"
                                            value={flightData.price_adult}
                                            onChange={handleChange}
                                        />
                                        <label className='sm'>Giá vé người lớn</label>
                                    </label>
                                </div>
                                <div className=" ">
                                    <label className='InputModal'>
                                        <input
                                            className='rounded-[28px] outline-none w-full custom-date-input text-slate-700'
                                            type="text"
                                            name="price_child"
                                            value={flightData.price_child}
                                            onChange={handleChange}
                                        />
                                        <label className='sm'>Giá vé trẻ em</label>
                                    </label>
                                </div>
                                <div className=" ">
                                    <label className='InputModal'>
                                        <input
                                            className='rounded-[28px] outline-none w-full custom-date-input text-slate-700'
                                            type="text"
                                            name="price_infant"
                                            value={flightData.price_infant}
                                            onChange={handleChange}
                                        />
                                        <label className='sm'>Giá vé em bé</label>
                                    </label>
                                </div>
                            </div>
                            <button onClick={handleSubmit} className='flex justify-center w-full bg-primary text-primary cursor-pointer fill-white py-3 px-4 hover:bg-primary_dark hover:text-white'>
                                <div className='label md'>Thêm</div>
                            </button>
                        </div>
                    </div>
                )}
                <div className='max-w-full w-1280 py-20 px-8 m-auto'>
                    <div className='flex justify-between'>
                        <h1 className='font-bold text-2xl'>Danh sách chuyến bay</h1>
                        <div className='py-4 px-8 flex flex-col gap-3'>
                            <h2 className='subheading md flex-grow text-[18px] leading-7 font-bold'>Lọc kết quả</h2>
                            {airlines.length > 0 ? (
                                <div className='flex gap-5'>
                                    {airlines.map((airline) => (
                                        <div key={airline._id}>
                                            <input
                                                type="checkbox"
                                                value={airline._id}
                                                onChange={handleCheckboxChange}
                                                checked={selectedAirlines.includes(airline._id)}
                                            />
                                            <label> {airline.name}</label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Đang tải danh sách các hãng bay...</p>
                            )}
                        </div>
                    </div>
                    {loading ? (
                        <p>dang tai</p>
                    ) : (
                        <div className='grid grid-cols-3 gap-4'>
                            {flights.length > 0 ? (
                                flights.map((flight) => (
                                    <div key={flight._id} className='relative'>
                                        <div className='cart-airport bg-white py-4 px-4'>
                                            <div className='flex gap-2'>
                                                <label className='md'>Hãng bay:</label>
                                                <p className='subheading sm'>{flight.airline.name}</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Số máy bay:</label>
                                                <p className='subheading sm'>{flight.flight_number}</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Điểm đi:</label>
                                                <p className='subheading sm'>{flight.departure_airport.name} ({flight.departure_airport.code})</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Điểm đến:</label>
                                                <p className='subheading sm'>{flight.arrival_airport.name} ({flight.arrival_airport.code})</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Ngày đi:</label>
                                                <p className='subheading sm'>{new Date(flight.departure_date).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Giờ đi:</label>
                                                <p className='subheading sm'>{new Date(flight.departure_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Ngày đến:</label>
                                                <p className='subheading sm'>{new Date(flight.arrival_date).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Giờ đến:</label>
                                                <p className='subheading sm'>{new Date(flight.arrival_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Giá vé người lớn:</label>
                                                <p className='subheading sm'>{formatCurrency(flight.price_adult.toLocaleString())} VND</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Giá vé trẻ em:</label>
                                                <p className='subheading sm'>{formatCurrency(flight.price_child.toLocaleString())} VND</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Giá vé em bé:</label>
                                                <p className='subheading sm'>{formatCurrency(flight.price_infant.toLocaleString())} VND</p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <label className='md'>Số lượng chỗ:</label>
                                                <p className='subheading sm'>{flight.available_seats}</p>
                                            </div>
                                        </div>
                                        <div className='absolute right-[70px] top-[6px] cursor-pointer hover:underline'>Sửa</div>
                                        <button className='absolute right-6 top-[6px] cursor-pointer hover:underline'>Xóa</button>
                                    </div>
                                ))
                            ) : (
                                <p>kh co</p>
                            )}
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}

export default FlightManager