/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css"
import { Image } from "react-bootstrap";

const Menu = () => {
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const menu = [
        {
            name: "Chart",
            value: "/input_data"
        },
    ];

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const closeSidebar = () => {
        setShowSidebar(false);
    };

    return (
        <div className="container-fluid pt-3 px-5" style={{ marginBottom: '-2vw' }}>
            <div className="row">
                <div className="col d-flex align-items-center justify-content-between">
                    <div className="text-start">
                        <Link to="/">
                            <img className="img-fluid" src="../public/Assets/BCA_Finance.svg" alt="Menu" style={{ height:'2vw' }} />
                        </Link>
                    </div>
                    <div className="text-end"> 
                        <Link to="/input_data">
                            <img className="img-fluid" src="../public/Assets/Up_Right_Arrow.png" alt="Menu" style={{ height:'3vw' }} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;