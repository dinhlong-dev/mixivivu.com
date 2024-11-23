import React from "react";
import Header from './Header'
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

const Home = () => {
    return (
        <div className="w-full h-full">
            <Outlet />
            {/* <Header /> */}
        </div>
    )
}

export default Home