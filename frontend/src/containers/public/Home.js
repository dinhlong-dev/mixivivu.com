import React from "react";
import Header from './Header'
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

const Home = () => {
    return (
        <div className="w-full h-full">
            <Header />
            <Outlet />
        </div>
    )
}

export default Home