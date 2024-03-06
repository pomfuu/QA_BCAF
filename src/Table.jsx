/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css"
import Menu from "./Menu";
import TablesAll from "./TablesAll";

const Table = () => {
    return (
        <div>
            <Menu/>
            <div className="col-10 my-4" style={{ paddingLeft: "20vw" }}>
                <TablesAll />
            </div>
        </div>
    );
};

export default Table;