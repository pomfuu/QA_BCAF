/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ChartsFebruari from './componentsChart/ChartsFebruari';
import ChartsMaret from './componentsChart/ChartsMaret';
import "./main.css"
import ContentRight from './Gallery/ContentRight';
import { Image } from 'react-bootstrap';
import star from '../public/Assets/star.svg';

const ChartsAll = () => {
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonth = monthNames[currentDate.getMonth()];
        setSelectedMonth(currentMonth);
    }, []);

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
    };

    return (
    <div className='container-fluid'>
        <div className="row align-items-center">
                <div className="col-4 text-center font2 mx-auto">
                    <div className="d-flex align-items-center justify-content-center"> {/* Added justify-content-center */}
                        <p style={{ fontSize: '3vw', marginBottom: '-0.9vw' }}>QA DASHBOARD</p>
                        <Image style={{ height:'2vw' }} className='img-fluid' src={star}></Image>
                    </div>
                    <DropdownButton
                        className='fw-semibold text-center custom-dropdown-button'
                        style={{ fontSize: '1.5vw '}}
                        id="dropdown-basic-button"
                        title={`${selectedMonth + ' Edition'|| 'Select Month'}`}
                    >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                            <Dropdown.Item key={index} onClick={() => handleMonthSelect(month)}>{month}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                </div>
        </div>
        <div className="row container-fluid">
            <div className="col-12">
                {selectedMonth === 'February' && <ChartsFebruari />}
                {selectedMonth === 'March' && <ChartsMaret />}
            </div>
            <div className="col-12">
                <ContentRight selectedMonth={selectedMonth} />
            </div>
        </div>
    </div>
    );
};

export default ChartsAll;
