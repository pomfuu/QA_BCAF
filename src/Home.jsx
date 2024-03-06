/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css"
import Menu from "./Menu";
import ChartsAll from "./ChartsAll";


const Home = () => {
    return (
        <div>
            <Menu/>
            <div className="container-fluid px-5">
                <ChartsAll />
            </div>
        </div>
    );
};

export default Home;