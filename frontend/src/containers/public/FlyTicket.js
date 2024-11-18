import React from "react";
import Header from './Header'
import LayoutMain from "./LayoutMain";
import { Footer } from "./Footer";
import SearchAirport from "../System/SearchAirport"

const FlyTicket = () => {
    return (
        <div className="w-full h-full">
            <Header />
            <LayoutMain />
            <Footer />
            <SearchAirport />
        </div>
    )
}

export default FlyTicket