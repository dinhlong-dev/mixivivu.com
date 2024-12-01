import React, { useEffect, useRef, useState } from 'react'
import Header from './Header'
import Home from './Home'
import DatePicker, { registerLocale } from 'react-datepicker';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';

const ResultSeach = () => {
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const handleOptionChange = (event) => {
    if (event.target.value === 'roundTrip') {
      setIsRoundTrip(true);
    }
    else {
      setIsRoundTrip(false);
    }
  }

  // ham chon thoi gian
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const datePickerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer); // Dọn dẹp timer khi component bị unmount 
  }, []);

  const handleDepartureDateChange = (date) => {
    setDepartureDate(date);
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false);
    }
  };

  const handleReturnDateChange = (date) => {
    setReturnDate(date);
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false);
    }
  };

  // ham tim kiem airport
  const location = useLocation();
  const { flights, searchInfo } = location.state || { flight: {}, searchInfo: {} };

  const [departureQuery, setDepartureQuery] = useState(searchInfo.departureQuery || '');
  const [arrivalQuery, setArrivalQuery] = useState(searchInfo.arrivalQuery || '');
  const [departureDate, setDepartureDate] = useState(searchInfo?.departureDate || '');
  const [returnDate, setReturnDate] = useState(searchInfo?.returnDate || '');
  const [adults, setAdults] = useState(searchInfo?.adults || 1);
  const [children, setChildren] = useState(searchInfo?.children || 0);
  const [infants, setInfants] = useState(searchInfo?.infants || 0);
  const [departureCode, setDepartureCode] = useState(searchInfo?.departureCode || '');
  const [arrivalCode, setArrivalCode] = useState(searchInfo?.arrivalCode || '');
  const [departureName, setDepartureName] = useState(searchInfo?.departureName || '');
  const [arrivalName, setArrivalName] = useState(searchInfo?.arrivalName || '');
  const [formattedDepartureDate, setFormattedDepartureDate] = useState(searchInfo?.formattedDepartureDate || '');
  const [formattedReturnDate, setFormattedReturnDate] = useState(searchInfo?.formattedReturnDate || '');

  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState([]);

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

    fetchSuggestions(arrivalQuery, setArrivalSuggestions);
  }, [arrivalQuery]);

  // Hàm để xử lý sự kiện click vào thẻ li
  const handleSuggestionClick = (suggestion, setQuery) => {
    setQuery(`${suggestion.name} (${suggestion.code})`);
    setDepartureSuggestions([]);
    setArrivalSuggestions([]);
  };

  // Click open 
  const [openStates, setOpenStates] = useState(false);
  const handleClick = (id) => {
    setOpenStates(prevStates => ({
      ...prevStates,
      [id]: !prevStates[id] // Đảo ngược trạng thái mở/đóng của thẻ cha với ID tương ứng 
    }));
  };

  // Ham tra ket qua tim kiem tu flight page
  useEffect(() => {
    // Cập nhật state khi searchInfo thay đổi
    if (searchInfo?.departureQuery) setDepartureQuery(searchInfo.departureQuery);
    if (searchInfo?.arrivalQuery) setArrivalQuery(searchInfo.arrivalQuery);
    if (searchInfo?.departureDate) setDepartureDate(searchInfo.departureDate);
    if (searchInfo?.returnDate) setReturnDate(searchInfo.returnDate);
  })

  // Hàm handle khi click vào một chiều
  const handleButtonClick = () => {
    setIsRoundTrip(!isRoundTrip);
  }

  // định dạng hiển thị tiền
  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // 
  const [selectedFlightID, setSelectedFlightID] = useState(null)
  const handleButtonNotOpenClick = (e) => {
    setIsChoose(!isChoose)
    e.stopPropagation();
  };

  // Lấy danh sách các hãng bay từ chuyến bay
  const [filterAirlines, setFilterAirlines] = useState([]);
  // const airlines = Array.from(new Set(flights.map(flight => flight.airline.name)));

  const filteredFlights = filterAirlines.length > 0
    ? flights.filter(flights => filterAirlines.includes(flights.airline.name))
    : flights;

  // Handle IsChoosed
  const [isChoose, setIsChoose] = useState(false)

  return (
    <div className='LayoutMain'>
      <div className='FlightSearch w-full max-w-[1280px] bg-white px-8 py-4 m-auto'>
        <div className='h-7 flex gap-3 items-center'>
          <div className='fill-white stroke-[#475467]'>
            <svg className='relative top-[-2px]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 17H16M11.0177 2.76401L4.23539 8.03914C3.78202 8.39176 3.55534 8.56807 3.39203 8.78887C3.24737 8.98446 3.1396 9.2048 3.07403 9.43907C3 9.70353 3 9.99071 3 10.5651V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V10.5651C21 9.99071 21 9.70353 20.926 9.43907C20.8604 9.2048 20.7526 8.98446 20.608 8.78887C20.4447 8.56807 20.218 8.39176 19.7646 8.03914L12.9823 2.76401C12.631 2.49076 12.4553 2.35413 12.2613 2.30162C12.0902 2.25528 11.9098 2.25528 11.7387 2.30162C11.5447 2.35413 11.369 2.49076 11.0177 2.76401Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </div>
          <a href='/flyticket'>
            <div className='flex items-center gap-3'>
              <svg className='w-4 h-4 stroke-[#d0d5dd]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              <div className='text-[#475467]'>Tìm vé máy bay</div>
            </div>
          </a>
          <a href='/flyticket/result-search'>
            <div className='flex items-center gap-3'>
              <svg className='w-4 h-4 stroke-[#d0d5dd]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              <div className='text-primary hover:text-primary_base'>{departureCode} - {arrivalCode}</div>
            </div>
          </a>
        </div>
      </div>

      <div className='section-bg'>
        <div className='w-full max-w-[1280px] m-auto flex flex-col py-20 px-8 gap-10'>
          <div className='cart-section px-5 py-6 z-10'>
            <div className='flex flex-col gap-6'>
              <div className='flex gap-4 items-center'>
                <button onClick={handleButtonClick} type='button' className='flex gap-2 text-primary fill-primary border-none bg-transparent shadow-none h-fit w-fit justify-center items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.6667 14.1667H3.33337M3.33337 14.1667L6.66671 10.8333M3.33337 14.1667L6.66671 17.5M3.33337 5.83333H16.6667M16.6667 5.83333L13.3334 2.5M16.6667 5.83333L13.3334 9.16667" stroke="#0E4F4F" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  <div className='text-[14px] text-[#0e4f4f]'>{!isRoundTrip ? 'Khứ hồi' : 'Một chiều'}</div>
                </button>
                <div>
                  <div className='relative'>
                    <button type='button' className='flex gap-2 text-primary border-none bg-transparent shadow-none h-fit w-fit justify-center items-center'>
                      <svg className='w-5 h-5 stroke-primary fill-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 20C5.33579 17.5226 8.50702 16 12 16C15.493 16 18.6642 17.5226 21 20M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                      <div className='text-[14px] text-[#0e4f4f]'>1</div>
                      <svg className='w-5 h-5 stroke-primary fill-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                  </div>
                </div>
                <label for=":r13:" className=" Checkbox_container__ccFUl w-fit flex gap-2 items-start cursor-pointer">
                  <input className='w-0 h-0 absolute opacity-0' id=":r13:" type="checkbox" name="type" />
                  <span className="Checkbox_checkmark__81gnF Checkbox_sm__nLRCs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </span>
                  <div className="Checkbox_textGroup__Z0QZ_">
                    <div className="sm Checkbox_title__rGvCj label">Vé rẻ nhất tháng</div>
                    <p className="sm"></p>
                  </div>
                </label>
              </div>
              <div className='flex gap-4'>
                <div className='flex-grow'>
                  <div className=''>
                    <div className=''>
                      <label className='input_group'>
                        <svg className='relative top-[3px]' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M19.1667 7.76666C19.2189 7.55255 19.1891 7.32665 19.0833 7.13333C18.8133 6.6647 18.4533 6.25401 18.0241 5.92483C17.5949 5.59565 17.105 5.35445 16.5824 5.21509C16.0597 5.07572 15.5147 5.04093 14.9786 5.1127C14.4425 5.18447 13.9259 5.3614 13.4583 5.63333L11.6667 6.66666L7.49999 4.70833C7.38154 4.64696 7.25007 4.61493 7.11666 4.61493C6.98325 4.61493 6.85179 4.64696 6.73333 4.70833L4.23333 6.15C4.10978 6.22126 4.00659 6.32305 3.93363 6.44561C3.86068 6.56818 3.8204 6.70741 3.81666 6.85C3.81263 6.99364 3.8458 7.13588 3.91297 7.26292C3.98014 7.38995 4.07901 7.49746 4.2 7.575L6.95 9.30833L5.49999 10.1417L1.51666 10.625C1.35653 10.6448 1.2056 10.7107 1.08218 10.8146C0.958764 10.9185 0.868172 11.0561 0.821404 11.2105C0.774636 11.3649 0.773703 11.5296 0.818719 11.6845C0.863735 11.8395 0.952763 11.978 1.07499 12.0833L4.02499 14.6333C4.41337 15.004 4.91075 15.2398 5.44353 15.3058C5.97632 15.3719 6.51621 15.2646 6.98333 15L18.75 8.275C18.8503 8.22294 18.9389 8.15103 19.0106 8.06365C19.0822 7.97626 19.1353 7.87522 19.1667 7.76666ZM6.22499 13.6C6.06492 13.6881 5.88033 13.7211 5.69964 13.694C5.51896 13.6669 5.35218 13.5812 5.225 13.45L3.64166 12.0917L5.91666 11.8167C6.02846 11.8023 6.13619 11.7655 6.23333 11.7083L9.03333 10.1C9.15807 10.028 9.26202 9.9249 9.33505 9.80076C9.40807 9.67662 9.44768 9.53567 9.45 9.39166C9.4517 9.24864 9.41657 9.10758 9.34798 8.98206C9.27938 8.85654 9.17963 8.7508 9.05833 8.675L6.30833 6.93333L7.225 6.40833L11.3917 8.34166C11.5101 8.40303 11.6416 8.43506 11.775 8.43506C11.9084 8.43506 12.0399 8.40303 12.1583 8.34166L14.2917 7.10833C14.7288 6.86333 15.2295 6.75538 15.7288 6.79847C16.2281 6.84156 16.7029 7.03371 17.0917 7.35L6.22499 13.6Z" fill="#98A2B3"></path></svg>
                        <input
                          type="text"
                          placeholder="Vui lòng nhập điểm đi"
                          className="departure rounded-[28px] outline-none text-slate-700 w-full h-6 pl-1"
                          value={departureQuery}
                          onChange={(e) => setDepartureQuery(e.target.value)}
                        />
                        <label className="absolute top-[-13px] left-6 text-ab_text text-fz_14">Điểm đi</label>
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
                  </div>
                </div>
                <div className='flex-grow'>
                  <div className=''>
                    <div className=''>
                      <label className='input_group'>
                        <svg className='relative top-[3px]' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.6 13.525C17.3129 12.4729 16.6248 11.5754 15.6833 11.025L13.925 9.99997L13.525 5.44164C13.514 5.3085 13.4712 5.17995 13.4001 5.06682C13.3291 4.9537 13.2318 4.85932 13.1167 4.79164L10.6167 3.3583C10.49 3.28516 10.3463 3.24666 10.2 3.24666C10.0537 3.24666 9.91001 3.28516 9.78333 3.3583C9.65667 3.42747 9.55015 3.52835 9.47419 3.65106C9.39822 3.77376 9.35543 3.91409 9.35 4.0583L9.225 7.3083L7.76666 6.47497L5.38333 3.26664C5.28642 3.13805 5.15432 3.04029 5.00303 2.98519C4.85173 2.93009 4.68771 2.92 4.5308 2.95614C4.37389 2.99228 4.23081 3.07311 4.11886 3.18885C4.00691 3.30459 3.93089 3.45028 3.9 3.6083L3.175 7.44997C3.04874 7.97076 3.09316 8.51834 3.30171 9.01196C3.51027 9.50559 3.87191 9.91914 4.33333 10.1916L16.05 16.95C16.2383 17.0608 16.4626 17.0931 16.6746 17.0401C16.8866 16.9871 17.0693 16.853 17.1833 16.6666C17.4582 16.197 17.6366 15.6772 17.7082 15.1378C17.7797 14.5983 17.7429 14.05 17.6 13.525ZM16.0333 15L5.16666 8.74997C5.01083 8.65485 4.89056 8.51118 4.82431 8.34106C4.75807 8.17093 4.74953 7.98376 4.8 7.8083L5.18333 5.77497L6.56666 7.6083C6.63384 7.69952 6.7189 7.77608 6.81666 7.8333L9.60833 9.44997C9.73282 9.52197 9.87383 9.56052 10.0176 9.56189C10.1614 9.56325 10.3032 9.52737 10.429 9.45774C10.5548 9.38811 10.6605 9.2871 10.7357 9.16454C10.811 9.04198 10.8532 8.90203 10.8583 8.7583L10.9917 5.5083L11.9 6.0333L12.3 10.5916C12.3119 10.7256 12.356 10.8546 12.4285 10.9678C12.5011 11.081 12.5999 11.1749 12.7167 11.2416L14.85 12.5C15.1275 12.6601 15.3706 12.8736 15.5651 13.1282C15.7596 13.3828 15.9018 13.6734 15.9833 13.9833C16.0763 14.3141 16.0934 14.6616 16.0333 15Z" fill="#98A2B3"></path></svg>
                        <input
                          type="text"
                          placeholder="Vui lòng nhập điểm đến"
                          className="destination rounded-[28px] outline-none text-slate-700 w-full h-6 pl-1"
                          value={arrivalQuery}
                          onChange={(e) => setArrivalQuery(e.target.value)}
                        />
                        <label className="absolute top-[-13px] left-6  text-ab_text text-fz_14">Điểm đến</label>
                      </label>
                      {arrivalSuggestions.length > 0 && (
                        <ul className='suggestions-dropdown suggestions-dropdown_arrival'>
                          {arrivalSuggestions.map((suggestions, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestions, setArrivalQuery)}>
                              {suggestions.name} ({suggestions.code})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex-grow'>
                  <div className=''>
                    <div className=''>
                      <label className='input_group'>
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
                              value={departureDate}
                              readOnly
                            />
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {!isRoundTrip && (
                  <div className='flex-grow'>
                    <div className=''>
                      <div className=''>
                        <label className='input_group'>
                          <svg className='relative' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path className='stroke-[#98a2b3]' d="M3 9H21M7 3V5M17 3V5M6 12H10V16H6V12ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                          <label className="absolute top-[-12px] left-6 text-ab_text text-fz_14">Ngày về</label>
                          <DatePicker
                            ref={datePickerRef}
                            selected={returnDate}
                            onChange={handleReturnDateChange}
                            minDate={new Date()}
                            // shouldCloseOnSelect={true}
                            dateFormat="dd/MM/yyyy"
                            locale="vi-custom"
                            customInput={
                              <input
                                type='text'
                                className="rounded-[28px] outline-none w-full custom-date-input text-slate-700"
                                value={returnDate}
                                readOnly
                              />
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                <button type="button" className="rounded-100 gap-2 Button_button__QHarr FlightSearchNavigation_submit-btn__CVUMl Button_button-normal__y4h10 Button_button-color__7QnYK  ">
                  <div className="label md">Tìm kiếm</div>
                </button>
              </div>
            </div>
          </div>
          <div className='m-auto'>
            <div className='flex items-center gap-4'>
              <div className="Steps_step-item__XtHlS  flex flex-col gap-4 items-center justify-center text-center">
                <div className="Steps_step-icon__PzJTo Steps_step-icon-inprogress__Ep1hC "></div>
                <div className="Steps_step-body__QRspi">
                  <p className="subheading sm">Chọn chuyến bay</p>
                  <p className="md">Vui lòng chọn chuyến bay</p>
                </div>
              </div>
              <div className="Steps_step-item__XtHlS  flex flex-col gap-4 items-center justify-center text-center">
                <div className="Steps_step-icon__PzJTo  "></div>
                <div className="Steps_step-body__QRspi">
                  <p className="subheading sm">Đặt chỗ</p>
                  <p className="md">Điền thông tin để đặt chỗ</p>
                </div>
              </div>
              <div className="Steps_step-item__XtHlS [&:nth-child(3)]:after:hidden flex flex-col gap-4 items-center justify-center text-center">
                <div className="Steps_step-icon__PzJTo  "></div>
                <div className="Steps_step-body__QRspi">
                  <p className="subheading sm">Thanh toán</p>
                  <p className="md">Thanh toán để nhận vé máy bay</p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-8'>
            <div>
              <div className='FlightSidebar_side-bar__lbiAI flex flex-col'>
                <div className='FlightSidebar_side-bar__header__GQbTV'>
                  <div className='subheading md flex-grow text-[18px] leading-7 font-bold'>Lọc kết quả</div>
                </div>
                <div>
                  <div className='FlightSidebar_filter-item__jtakl'>
                    <label className='text-[16px] leading-6 font-medium'>Hiển thị theo</label>
                    {/* {airlines.map(airline => (
                      <label key={airline} className='Checkbox_container__ccFUl'>

                      </label>
                    ))} */}
                  </div>
                </div>
              </div>
            </div>

            <div className='px-6 py-4 flex flex-col gap-4 flex-grow max-w-full'>
              <div className='Card_card__rC1zg '>
                <div className='Collapse_open-header__wyuXQ'>
                  <div className='flex gap-4 items-center px-6 py-6 cursor-pointer'>
                    <svg className='fill-[#77dada]' xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 20 20" fill="none"><path d="M19.1667 7.76666C19.2189 7.55255 19.1891 7.32665 19.0833 7.13333C18.8133 6.6647 18.4533 6.25401 18.0241 5.92483C17.5949 5.59565 17.105 5.35445 16.5824 5.21509C16.0597 5.07572 15.5147 5.04093 14.9786 5.1127C14.4425 5.18447 13.9259 5.3614 13.4583 5.63333L11.6667 6.66666L7.49999 4.70833C7.38154 4.64696 7.25007 4.61493 7.11666 4.61493C6.98325 4.61493 6.85179 4.64696 6.73333 4.70833L4.23333 6.15C4.10978 6.22126 4.00659 6.32305 3.93363 6.44561C3.86068 6.56818 3.8204 6.70741 3.81666 6.85C3.81263 6.99364 3.8458 7.13588 3.91297 7.26292C3.98014 7.38995 4.07901 7.49746 4.2 7.575L6.95 9.30833L5.49999 10.1417L1.51666 10.625C1.35653 10.6448 1.2056 10.7107 1.08218 10.8146C0.958764 10.9185 0.868172 11.0561 0.821404 11.2105C0.774636 11.3649 0.773703 11.5296 0.818719 11.6845C0.863735 11.8395 0.952763 11.978 1.07499 12.0833L4.02499 14.6333C4.41337 15.004 4.91075 15.2398 5.44353 15.3058C5.97632 15.3719 6.51621 15.2646 6.98333 15L18.75 8.275C18.8503 8.22294 18.9389 8.15103 19.0106 8.06365C19.0822 7.97626 19.1353 7.87522 19.1667 7.76666ZM6.22499 13.6C6.06492 13.6881 5.88033 13.7211 5.69964 13.694C5.51896 13.6669 5.35218 13.5812 5.225 13.45L3.64166 12.0917L5.91666 11.8167C6.02846 11.8023 6.13619 11.7655 6.23333 11.7083L9.03333 10.1C9.15807 10.028 9.26202 9.9249 9.33505 9.80076C9.40807 9.67662 9.44768 9.53567 9.45 9.39166C9.4517 9.24864 9.41657 9.10758 9.34798 8.98206C9.27938 8.85654 9.17963 8.7508 9.05833 8.675L6.30833 6.93333L7.225 6.40833L11.3917 8.34166C11.5101 8.40303 11.6416 8.43506 11.775 8.43506C11.9084 8.43506 12.0399 8.40303 12.1583 8.34166L14.2917 7.10833C14.7288 6.86333 15.2295 6.75538 15.7288 6.79847C16.2281 6.84156 16.7029 7.03371 17.0917 7.35L6.22499 13.6Z" fill="var(--primary-base)"></path></svg>
                    <div className='flex flex-col gap-2 flex-grow'>
                      <div className='flex gap-2 items-center'>
                        <label className="sm">{departureName} ({departureCode})</label>
                        <svg className='stroke-black' width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="var(--black)" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        <label className="sm">{arrivalName} ({arrivalCode})</label>
                      </div>
                      <p className='sm'>{formattedDepartureDate}</p>
                    </div>
                    <svg className='stroke-[#77dada]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 12L18 12" stroke="var(--primary-base)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </div>
                </div>

                <div className='Collapse_collapse__g6PnD'>
                  <div>
                    <div>
                      <div className='flex justify-center gap-3 px-6 py-4 overflow-auto max-w-full'>
                        <div className='FlightCalendar_flight-calendar-item__1IeW2  cursor-pointer'>
                          <div className='text-[#475467]'>Thứ 3</div>
                          <div className='subheading md FlightCalendar_date__THTRM'>26</div>
                        </div>
                        <div className='FlightCalendar_flight-calendar-item__1IeW2  cursor-pointer'>
                          <div className='text-[#475467]'>Thứ 3</div>
                          <div className='subheading md FlightCalendar_date__THTRM'>26</div>
                        </div>
                        <div className='FlightCalendar_flight-calendar-item__1IeW2  cursor-pointer'>
                          <div className='text-[#475467]'>Thứ 3</div>
                          <div className='subheading md FlightCalendar_date__THTRM'>26</div>
                        </div>
                        <div className='FlightCalendar_flight-calendar-item__1IeW2  cursor-pointer'>
                          <div className='text-[#475467]'>Thứ 3</div>
                          <div className='subheading md FlightCalendar_date__THTRM'>26</div>
                        </div>
                        <div className='FlightCalendar_flight-calendar-item__1IeW2  cursor-pointer'>
                          <div className='text-[#475467]'>Thứ 3</div>
                          <div className='subheading md FlightCalendar_date__THTRM'>26</div>
                        </div>
                      </div>
                      {flights?.departureFlights && flights.departureFlights.length > 0 ? (
                        <div className='flex flex-col gap-4 px-6 py-4'>
                          <div className='flex flex-col gap-4'>
                            {flights.departureFlights.map(flights => (
                              <div key={flights._id} className='Card_card__rC1zg '>
                                <div
                                  onClick={() => { handleClick(flights._id) }}
                                  className={`${openStates[flights._id] ? 'Collapse_open-header__wyuXQ' : ''}`}
                                >
                                  <div className='FlightItemCard_header__fyioF p-6 cursor-pointer flex gap-4 items-center'>
                                    <div className='w-full flex gap-4'>
                                      <div className='flex gap-4 items-center'>
                                        <div className='w-12 h-12'>
                                          <div className="w-full h-full relative overflow-hidden">
                                            <img
                                              alt="mixivivu"
                                              src="https://minio.fares.vn/mixivivu-dev/icons/logo-airline/VJ.png"
                                              width="100%"
                                              height="100%"
                                              loading="lazy"
                                              className="object-cover"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex flex-col gap-2 flex-grow text-left">
                                          <label className="sm">{flights.flight_number}</label>
                                          <p className="text-[#667085] sm">{flights.airline.name}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='w-full flex gap-4'>
                                      <div className="FlightItemCard_destination___qpoR"><label className="sm">{new Date(flights.departure_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</label><p className="sm">{flights.departure_airport.code}</p></div>
                                      <div className="FlightItemCard_destination___qpoR"><label className="sm">{new Date(flights.arrival_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</label><p className="sm">{flights.arrival_airport.code}</p></div>
                                    </div>
                                    <div className="FlightItemCard_price__yFFyH">
                                      <label className="sm">{formatCurrency(flights.totalPrice.toLocaleString('vi-VN'))}</label>
                                      <p className="sm">VND</p>
                                    </div>
                                    <button onClick={handleButtonNotOpenClick} type="button" className="Button_button__QHarr FlightItemCard_select-btn__L2VsD Button_button-sm__ljQtM Button_button-outline__YRytX  ">
                                      <div className="label sm" onClic>{!isChoose ? 'Chọn' : 'Chọn lại'}</div>
                                    </button>
                                    <div>
                                      <svg className='stroke-[#475467]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke="var(--gray-600)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                    </div>
                                  </div>
                                </div>
                                <div className={`${openStates[flights._id] ? 'Collapse_collapse__g6PnD h-[246px]' : 'Collapse_collapsed-content__UzsXV Collapse_collapse__g6PnD h-0'}`}>
                                  <div>
                                    <div className="FlightItemCard_content__eJaAQ">
                                      <div className="flex gap-[19px] flex-grow">
                                        <div className="FlightItemCard_vertical-steps__Wzkcv">
                                          <div className="FlightItemCard_vertical-big-dot__68E_0"></div>
                                          <div className="FlightItemCard_vertical-small-dot__pPBY5"></div>
                                          <div className="FlightItemCard_vertical-small-dot__pPBY5"></div>
                                          <div className="FlightItemCard_vertical-small-dot__pPBY5"></div>
                                          <div className="FlightItemCard_vertical-small-dot__pPBY5"></div>
                                          <div className="FlightItemCard_vertical-small-dot__pPBY5"></div>
                                          <div className="FlightItemCard_vertical-big-dot__68E_0"></div>
                                        </div>
                                        <div className="flex flex-col gap-3 justify-between">
                                          <div className="flex gap-2 items-center">
                                            <label className="sm">{new Date(flights.departure_date).toLocaleDateString()} {new Date(flights.departure_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</label>
                                            <div className="FlightItemCard_dot__Fb_rm">
                                            </div><label className="sm">{flights.departure_airport.code}</label></div>
                                          <p className="sm">Thời gian chuyến đi: {flights.flight_duration} phút</p>
                                          <div className="flex gap-2 items-center">
                                            <label className="sm">{new Date(flights.arrival_date).toLocaleDateString()} {new Date(flights.arrival_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</label>
                                            <div className="FlightItemCard_dot__Fb_rm"></div>
                                            <label className="sm">{flights.arrival_airport.code}</label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-2">
                                        <div className="w-[30px] h-[30px] relative overflow-hidden">
                                          <img
                                            alt="mixivivu"
                                            src="https://minio.fares.vn/mixivivu-dev/icons/logo-airline/VJ.png"
                                            width="100%"
                                            height="100%"
                                            loading="lazy"
                                            className="object-cover"
                                          />
                                        </div>
                                        <p className="sm">Hãng: {flights.airline.name}</p>
                                        <p className="sm">Chuyến bay: {flights.flight_number}</p>
                                        <p className="sm">Hạng chỗ: {flights.seat_class}</p>
                                        <p className="sm">Máy bay: 321</p>
                                        <p className="sm">Hành lý xách tay: {flights.carry_on_baggage}</p>
                                        <p className="sm">Hành lý ký gửi: {flights.checked_baggage}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className='flex flex-col gap-4 py-4 px-6'>
                          <div className='flex flex-col items-center justify-center gap-5'>
                            <span className='no-flight'>
                              <span className='no-flight-child'>
                                <img
                                  src='data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27400%27%20height=%27360%27/%3e'
                                  alt=''
                                  aria-hidden='true'
                                  className='img-no-flight'
                                />
                              </span>
                              <img
                                alt=''
                                srcSet='https://mixivivu.com/_next/image?url=%2Fsad.png&w=640&q=75 1x, https://mixivivu.com/_next/image?url=%2Fsad.png&w=640&q=75 2x'
                                src='https://mixivivu.com/_next/image?url=%2Fsad.png&w=640&q=75'
                                decoding='async'
                                data-ning='intrinsic'
                                className='img-no_flight'
                              />
                            </span>
                            <div>Không tìm thấy vé phù hợp</div>
                          </div>
                        </div>
                      )}

                      {!isChoose && (
                        <div className='flex justify-between items-center Pagination_pagination__dV9rN'>
                          <div className="flex items-center gap-2 Pagination_left-pagination__IuI30">
                            <p className="sm">Đang xem:</p>
                            <div>
                              <label className="md Pagination_page-size__Rakop">
                                <input max="20" min="1" type="number" value="5" />
                              </label>
                            </div>
                            <p className="sm">của 9</p>
                          </div>

                          <ul className="Pagination_pagination-container__J4wRd ">
                            <li className="Pagination_pagination-left-item__Ni_lJ Pagination_pagination-item__ZzJmt Pagination_disabled__UwpSX">
                              <svg className='stroke-[#344054]' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.16602 10H15.8327M4.16602 10L9.16602 5M4.16602 10L9.16602 15" stroke="var(--gray-700)" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              <label className="sm">Trước</label>
                            </li>
                            <li className="Pagination_pagination-item__ZzJmt Pagination_selected__G5yaV">1</li>
                            <li className="Pagination_pagination-item__ZzJmt ">2</li>
                            <li className="Pagination_pagination-right-item__xEHMH Pagination_pagination-item__ZzJmt ">
                              <label className="sm">Tiếp</label>
                              <svg className='stroke-[#344054]' width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="var(--gray-700)" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isChoose && (
                <div className="Card_card__rC1zg CustomerInfo_customer-info__8_dK8">
                  <div className="CustomerInfo_customer-info__header__vUsm9">
                    <div className="subheading md">Thông tin hành khách</div>
                    <p className="sm text-[#f04438]">
                      * Quý Khách vui lòng sử dụng tiếng Việt không dấu và không sử dụng các ký tự đặc biệt.
                      <br />
                      * Vui lòng nhập đầy đủ tên hành khách và những thông tin khác xuất hiện trên (các) giấy tờ tùy thân do chính phủ cấp của hành khách. (Số Căn cước công dân hoặc Hộ chiếu, ngày hết hạn phải chính xác)
                      <br />
                      * Lưu ý đặc biệt: Hệ thống của hãng hàng không VietJet Air sẽ không cho phép khách hàng đặt vé quá 02 lần mà không thanh toán. Quý khách vui lòng chắc chắn khi đặt vé để đảm bảo thanh toán thành công.
                      <br />
                      * Nếu cần sự hỗ trợ, quý khách vui lòng liên hệ Hotline của Mixivivu: 0922 222 016.
                    </p>
                  </div><div className="CustomerInfo_customer-info__content__gFjoX">
                    <div className="flex flex-col gap-6">
                      <div className="flex gap-4 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 20C5.33579 17.5226 8.50702 16 12 16C15.493 16 18.6642 17.5226 21 20M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        <div className="flex flex-col gap-1">
                          <label className="sm">Người lớn</label>
                          <p className="md">Hành khách 1</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 CustomerInfo_input-group__U1xTl">
                        <div className="CustomerInfo_selectInput__Mwxef">
                          <div className="relative">
                            <div className=" ">
                              <label for=":r1i:" className="Input_input-group__6PMfq">
                                <input id=":r1i:" className="p-md" type="button" value="Nam" />
                                <svg className='stroke-[#98a2b3]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                <label for=":r1i:" className="sm "></label>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className=" ">
                          <label for=":r1j:" className="Input_input-group__6PMfq">
                            <input id=":r1j:" className="p-md" placeholder="Nhập họ" value="" />
                            <label for=":r1j:" className="sm Input_required__eYDG_">Họ</label>
                          </label>
                        </div>
                        <div className=" ">
                          <label for=":r1k:" className="Input_input-group__6PMfq">
                            <input id=":r1k:" className="p-md" placeholder="Nhập tên đệm và tên" value="" />
                            <label for=":r1k:" className="sm Input_required__eYDG_">Tên đệm và tên</label>
                          </label>
                        </div>
                        <div className=" ">
                          <label for=":r1l:" className="Input_input-group__6PMfq">
                            <input id=":r1l:" className="p-md" type="date" />
                            <label for=":r1l:" className="sm Input_required__eYDG_">Ngày sinh</label>
                          </label>
                        </div>
                        <div className=" ">
                          <label for=":r1m:" className="Input_input-group__6PMfq">
                            <input id=":r1m:" className="p-md" placeholder="Nhập CCCD" value="" />
                            <label for=":r1m:" className="sm Input_required__eYDG_">CCCD</label>
                          </label>
                        </div>
                        <div className=" ">
                          <label for=":r1n:" className="Input_input-group__6PMfq">
                            <input id=":r1n:" className="p-md" type="date" />
                            <label for=":r1n:" className="sm Input_required__eYDG_">Ngày hết hạn CCCD</label>
                          </label>
                        </div>
                      </div>
                      <div className="CustomerInfo_customer-info__footer__wrr_x">
                        <div className="grid grid-cols-2 gap-6 CustomerInfo_flight-packages__cPaVZ">
                          <div className="flex gap-6">
                            <div className="CustomerInfo_img-wrapper__Nyg9S">
                              <div className="w-full h-full relative overflow-hidden">
                                <img
                                  alt="mixivivu"
                                  src="/card-image.png"
                                  loading="lazy"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="sm">HAN → DAD</label>
                              <p className="sm">07:25, 01/12/2024</p>
                            </div>
                          </div>
                          <div>
                            <div className="CustomerInfo_selectInput__Mwxef">
                              <div className="relative">
                                <div className=" ">
                                  <label for=":r1o:" className="Input_input-group__6PMfq">
                                    <input id=":r1o:" className="p-md" type="button" value="Chọn hành lý ký gửi" />
                                    <svg className='stroke-[#3C4046]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                    <label for=":r1o:" className="sm "></label>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isChoose && (
                <div className="Card_card__rC1zg CustomerInfo_customer-info__8_dK8">
                  <div className="CustomerInfo_customer-info__header__vUsm9">
                    <div className="subheading md">Thông tin liên hệ</div>
                  </div>
                  <div className="CustomerInfo_customer-info__content__gFjoX">
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-2 gap-4 CustomerInfo_input-group__U1xTl">
                        <div className="relative">
                          <div className=" ">
                            <label for=":r1t:" className="Input_input-group__6PMfq">
                              <input id=":r1t:" className="p-md" type="button" value="Ông" />
                              <svg stroke='#98a2b3' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              <label for=":r1t:" className="sm "></label>
                            </label>
                          </div>
                        </div>
                        <div className=" ">
                          <label for=":r1u:" className="Input_input-group__6PMfq">
                            <input id=":r1u:" className="p-md" placeholder="Nhập họ" value="" />
                            <label for=":r1u:" className="sm ">Họ</label>
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 CustomerInfo_input-group__U1xTl">
                        <div className=" ">
                          <label for=":r1v:" className="Input_input-group__6PMfq">
                            <input id=":r1v:" className="p-md" placeholder="Nhập tên đệm và tên" value="" />
                            <label for=":r1v:" className="sm ">Tên</label>
                          </label>
                        </div>
                        <div className=" ">
                          <label for=":r20:" className="Input_input-group__6PMfq">
                            <input id=":r20:" className="p-md" placeholder="Nhập điện thoại" value="" />
                            <label for=":r20:" className="sm ">Điện thoại</label>
                          </label>
                        </div>
                      </div>
                      <button type="button" className="Button_button__QHarr  Button_button-normal__y4h10 Button_button-outline__YRytX  ">
                        <span className="box-border inline-block overflow-hidden w-initial h-initial bg-none opacity-100 border-0 m-0 p-0 relative max-w-full">
                          <span className="box-border block w-initial h-initial bg-none opacity-100 border-0 m-0 p-0 max-w-full">
                            <img alt="" aria-hidden="true" src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2715%27%20height=%2715%27/%3e" className="display: block; max-width: 100%; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px;" />
                          </span>
                          <img
                            srcset="https://mixivivu.com/_next/image?url=%2Fgmail.png&w=16&q=75 1x, https://mixivivu.com/_next/image?url=%2Fgmail.png&w=16&q=75 2x"
                            src="https://mixivivu.com/_next/image?url=%2Fgmail.png&w=16&q=75"
                            alt=''
                            decoding="async"
                            data-nimg="intrinsic"
                            className="absolute inset-0 box-border p-0 border-none m-auto block w-0 h-0 min-w-full max-w-full min-h-full max-h-full"
                          />
                        </span>
                        <div className="label md">Xác thực bằng gmail</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isChoose && (
                <div className="flex justify-between">
                  <button type="button" className="Button_button__QHarr  Button_button-normal__y4h10 Button_button-outline__YRytX  ">
                    <svg className='stroke-[#1d2939]' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.16602 10H15.8327M4.16602 10L9.16602 5M4.16602 10L9.16602 15" stroke="#344054" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <div className="label md">Quay lại</div>
                  </button>
                  <button type="button" className="Button_button__QHarr  Button_button-normal__y4h10 Button_button-color__7QnYK  " disabled="">
                    <div className="label md">Tiếp</div>
                    <svg className='stroke-[#1d2939]' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default ResultSeach