/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css"
import Menu from "./Menu";
import ChartsAll from "./ChartsAll";
import Header from "./Header";
import InputContent from "./InputContent";


const InputData = () => {
    return (
        <div>
            <Menu/>
            <div className="container-fluid px-5">
                <Header />
                <InputContent/>
            </div>


        </div>
    );
};

export default InputData;