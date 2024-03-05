/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css"
import Menu from "./componentsChart/Menu";
import ChartsAll from "./ChartsAll";


const Home = () => {
    return (
        <div>
            <Menu/>
            <div className="col-10 my-4" style={{ paddingLeft: "20vw" }}>
                <ChartsAll />
            </div>
        </div>
    );
};

export default Home;