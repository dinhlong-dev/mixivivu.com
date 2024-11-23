import React from "react";
import Header from './Header'
import LayoutMain from "./LayoutMain";
import { Footer } from "./Footer";

const FlyTicket = () => {
    return (
        <div className="w-full h-full">
            <Header />
            <LayoutMain />
            <Footer />
        </div>
    )
}

export default FlyTicket