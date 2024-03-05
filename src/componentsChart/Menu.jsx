/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ".././main.css"
import { Image } from "react-bootstrap";

const Menu = () => {
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const menu = [
        {
            name: "Chart",
            value: "/"
        },
        {
            name: "Table",
            value: "/table_dashboard"
        },
    ];

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const closeSidebar = () => {
        setShowSidebar(false);
    };

    return (
        <>
            <p
                className="d-lg-none"
                onClick={toggleSidebar}
            >
                {showSidebar ? "Close Sidebar" : "☰"}
            </p>
            <div
                className={`position-fixed top-0 bottom-0 rounded-end-4 start-0 vh-100% ${
                    showSidebar ? "col-6" : "col-2"
                } ${showSidebar ? "d-block" : "d-none"} d-lg-block`}
                style={{ backgroundColor:"#fffffc" }}
            >
                <p
                    className="position-absolute top-0 end-0 m-2"
                    onClick={closeSidebar}
                >
                    
                </p>
                <div className="m-5">
                <Link className="text-decoration-none fs-5 fw-semibold text-black" to={"/"}> <Image className="img-fluid" src="../../public/Assets/BCA_Finance.svg"></Image> </Link>
                <nav className="nav mt-5 flex-column">
                    {menu.map((value, index) => (
                        <Link
                            to={value.value}
                            key={index}
                            className={`${value.value.includes(
                                location.pathname
                            ) ? "rounded-2 text-decoration-none pb-2 fs-5 mb-4 text-black" : "text-decoration-none pb-2 fs-5 text-black mb-4"}`}
                        >
                            <div>{value.name}</div>
                        </Link>
                    ))}
                </nav>
                </div>
            </div>
        </>
    );
};

export default Menu;