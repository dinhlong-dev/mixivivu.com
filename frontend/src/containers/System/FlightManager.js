import React from 'react'
import { flight } from './css/flights.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

const FlightManager = () => {
    const [airports, setAirports] = useState([])
    const [departureQuery, setDepartureQuery] = useState('')
    const [arrivalQuery, setArrivalQuery] = useState('')
    const [departureSuggestions, setDepartureSuggestions] = useState([]);
    const [arrivalSuggestions, setArrivalSuggestions] = useState([]);
    const [isOpenCreateFlight, setisOpenCreateFlight] = useState(false)
    const [errors, setErrors] = useState('')
    const [flightData, setFlightData] = useState({
        flight_number: '',
        departure: '',
        arrival: '',
        departure_date: '',
        arrival_date: '',
        flight_duration: '',
        price_adult: '',
        price_child: '',
        price_ifant: '',
        available_seats: '',
        airline: '',
        seat_class: '',
        carry_on_baggage: '',
        checked_baggage: ''
    })

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

    const handleSuggestionClick = (suggestion, setQuery) => {
        setQuery(`${suggestion.name} (${suggestion.code})`);
        setDepartureSuggestions([]);
        setArrivalSuggestions([]);
    };

    const [airlines, setAirlines] = useState([]);  // Danh sách các hãng hàng không
    const [flightNumber, setFlightNumber] = useState('');  // Mã chuyến bay
    const [selectedAirline, setSelectedAirline] = useState('');  // Airline đã chọn

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

    const handleAirlineChange = (event) => {
        const selectedAirline = event.target.value;
        setSelectedAirline(selectedAirline);
        if (selectedAirline) {
            const airlineCode = airlines.find(airline => airline._id === selectedAirline)?.code || '';
            setFlightNumber(`${airlineCode}`);  // Mã chuyến bay bắt đầu với mã hãng hàng không
        }
    };

    const handleFlightNumberChange = (event) => {
        setFlightNumber(event.target.value);
    };

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
                                    placeholder='Nhập tên hoặc mã hãng bay'
                                    className='outline-none border-none text-[#1d2939] h-6'
                                    value={'airlineQuery'}
                                    onChange={'handleInputChange'}
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

                <div className='FlightManagement'>
                    {isOpenCreateFlight && (
                        <div className='py-20'>
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-3 gap-4 CustomerInfo_input-group__U1xTl">
                                    <div className=" ">
                                        <select className='InputModal w-full' id="airline" value={selectedAirline} onChange={handleAirlineChange}>
                                            <option value="">Select Airline</option>
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
                                                className="p-md"
                                                placeholder="Nhập code"
                                                value={flightNumber}
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
                                                    <li key={index} onClick={() => handleSuggestionClick(suggestions, setDepartureQuery)}>
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
                                                    <li key={index} onClick={() => handleSuggestionClick(suggestions, setArrivalQuery)}>
                                                        {suggestions.name} ({suggestions.code})
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <button onClick={'handleButtonSubmit'} className='flex justify-center w-full bg-primary text-primary cursor-pointer fill-white py-3 px-4 hover:bg-primary_dark hover:text-white'>
                                    <div className='label md'>Thêm</div>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className=''>
                        <h1>Danh sách chuyến bay</h1>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FlightManager