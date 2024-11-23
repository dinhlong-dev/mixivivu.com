import React, { useCallback } from "react";
import logo from '../../assets/logo.webp'
import { Button } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { path } from "../../ultils/constants";
import icons from '../../ultils/icons'


const { FaPhoneAlt } = icons


const Header = () => {
    // const navvigate = useNavigate()
    // const gologin = useCallback(() => {
    //     navvigate(path.LOGIN)
    // })

    return (
        <div className="w-full flex justify-center border border-solid border-gray-200">
            <div className="w-1280 flex items-center justify-between bg-white h-24 z-10">
                <div className="flex items-center gap-10">
                    <a href='/'>
                        <img
                            src={logo}
                            alt="logo"
                            className="max-w-[156px] h-[56px] object-contain mr-8"
                        />
                    </a>
                    <ul className="flex text-base gap-6 font-medium">
                        <li className="cursor-pointer py-3">Tìm du thuyền</li>
                        <Link to={`/${path.FLYTICKET}`}><li className="cursor-pointer py-3">Tìm vé máy bay</li></Link>
                        <li className="cursor-pointer py-3">Tìm khách sạn</li>
                        <li className="cursor-pointer py-3">Doanh nghiệp</li>
                        <li className="cursor-pointer py-3">Blog</li>
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