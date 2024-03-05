/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import TableFebruary from './ComponentsTable/TableFebruary';
import "./main.css"

const TablesAll = () => {
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        // Get current month
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
        <div>
            <DropdownButton
                className='fw-semibold custom-dropdown-button ms-auto text-end' 
                id="dropdown-basic-button"
                title={`${selectedMonth || 'Select Month'}`}
            >
                <Dropdown.Item onClick={() => handleMonthSelect('January')}>January</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('February')}>February</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('March')}>March</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('April')}>April</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('May')}>May</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('June')}>June</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('July')}>July</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('August')}>August</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('September')}>September</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('October')}>October</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('November')}>November</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMonthSelect('December')}>December</Dropdown.Item>
            </DropdownButton>

            {selectedMonth === 'February' && <TableFebruary />}
        </div>
    );
};

export default TablesAll;


