/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ChartsFebruari from './componentsChart/ChartsFebruari';
import ChartsMaret from './componentsChart/ChartsMaret';
import "./main.css"
import ContentRight from './Gallery/ContentRight';

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
    <div className='container-fluid mb-4'>
        <div className="row align-items-center mb-5">
                <div className="col-4 text-center font2 mx-auto">
                    <p style={{ fontSize: '3.6vw', marginBottom: '-0.7vw' }}>QA DASHBOARD</p>
                    <DropdownButton
                        className='fw-semibold fs-3 text-center custom-dropdown-button'
                        id="dropdown-basic-button"
                        title={`${selectedMonth + ' Edition'|| 'Select Month'}`}
                    >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                            <Dropdown.Item key={index} onClick={() => handleMonthSelect(month)}>{month}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                </div>
        </div>
        <div className="row">
            <div className="col-8">
                {selectedMonth === 'February' && <ChartsFebruari />}
                {selectedMonth === 'March' && <ChartsMaret />}
            </div>
            <div className="col-4">
                <ContentRight selectedMonth={selectedMonth} />
            </div>
        </div>
    </div>
    );
};

export default ChartsAll;
