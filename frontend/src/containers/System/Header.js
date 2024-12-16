import React from 'react'
import logo from '../../assets/logo.webp'
import { Button } from "../../components";
import { Link } from "react-router-dom";
import { path } from "../../ultils/constants";
import icons from '../../ultils/icons'


const { FaPhoneAlt } = icons

const Header = () => {
  return (
    <div className="w-full flex justify-center border border-solid border-gray-200">
      <div className="w-1280 flex items-center justify-between bg-white h-24 z-10">
        <div className="flex items-center gap-10">
          <a href='/admin/dashboard'>
            <img
              src={logo}
              alt="logo"
              className="max-w-[156px] h-[56px] object-contain mr-8"
            />
          </a>
          <ul className="flex text-base gap-6 font-medium">
            <a href='/admin/dashboard'><li className="cursor-pointer py-3">Trang chủ</li></a>
            <a href='/admin/flight'><li className="cursor-pointer py-3">Quản lý chuyến bay</li></a>
            <a href='/admin/airline'><li className="cursor-pointer py-3">Quản lý hãng bay</li></a>
            <a href='/admin/airport'><li className="cursor-pointer py-3">Quản lý sân bay</li></a>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-[16px] h-[16px]">
              <FaPhoneAlt />
            </div>
            <a className="font-bold text-primary" href="tel:0705470780">Hotline: 0705470780</a>
          </div>

          <div className="text-sm">
            <Button
              text={'Liên hệ Mixivivu'}
              textColor='text-primary'
              bgColor='bg-primary'
              bdRadius='rounded-100'
              px='px-4'
              py='py-[10px]'
              hoverbg='hover:bg-primary_dark'
              hovertext='hover:text-white'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header