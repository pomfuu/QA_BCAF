/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ChartsFebruari from './componentsChart/ChartsFebruari';
import ChartsMaret from './componentsChart/ChartsMaret';
import "./main.css"
import { Image } from 'react-bootstrap';
import star from '../public/Assets/star.svg';
import ContentRightFeb from './Gallery/ContentRightFeb';
import ChartsApril from './componentsChart/ChartsApril';
import ChartsMei from './componentsChart/ChartsMei';
import ChartsJuni from './componentsChart/ChartsJuni';
import ChartsJuly from './componentsChart/ChartsJuly';
import ChartsAgustus from './componentsChart/ChartsAgustus';
import ChartsSeptember from './componentsChart/ChartsSeptember';
import ChartsOktober from './componentsChart/ChartsOktober';
import ChartsNovember from './componentsChart/ChartsNovember';
import ChartsDesember from './componentsChart/ChartsDesember';
import ChartsJanuari from './componentsChart/ChartsJanuari';
import ContentRightJan from './Gallery/ContentRightJan';
import ContentRightMar from './Gallery/ContentRightMar';
import ContentRightApr from './Gallery/ContentRightApr';
import ContentRightMei from './Gallery/ContentRightMei';
import ContentRightJun from './Gallery/ContentRightJun';
import ContentRightJul from './Gallery/ContentRightJul';
import ContentRightAgs from './Gallery/ContentRightAgs';
import ContentRightSep from './Gallery/ContentRightSep';
import ContentRightOct from './Gallery/ContentRightOct';
import ContentRightNov from './Gallery/ContentRightNov';
import ContentRightDes from './Gallery/ContentRightDes';

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
                {selectedMonth === 'January' && <ChartsJanuari />}
                {selectedMonth === 'March' && <ChartsMaret />}
                {selectedMonth === 'April' && <ChartsApril />}
                {selectedMonth === 'May' && <ChartsMei />}
                {selectedMonth === 'June' && <ChartsJuni />}
                {selectedMonth === 'July' && <ChartsJuly />}
                {selectedMonth === 'August' && <ChartsAgustus />}
                {selectedMonth === 'September' && <ChartsSeptember />}
                {selectedMonth === 'February' && <ChartsFebruari />}
                {selectedMonth === 'October' && <ChartsOktober />}
                {selectedMonth === 'November' && <ChartsNovember />}
                {selectedMonth === 'December' && <ChartsDesember />}
            </div>
            <div className="col-12">
                {selectedMonth === 'January' && <ContentRightJan />}
                {selectedMonth === 'March' && <ContentRightMar />}
                {selectedMonth === 'April' && <ContentRightApr />}
                {selectedMonth === 'May' && <ContentRightMei />}
                {selectedMonth === 'June' && <ContentRightJun />}
                {selectedMonth === 'July' && <ContentRightJul />}
                {selectedMonth === 'August' && <ContentRightAgs />}
                {selectedMonth === 'September' && <ContentRightSep />}
                {selectedMonth === 'February' && <ContentRightFeb />}
                {selectedMonth === 'October' && <ContentRightOct />}
                {selectedMonth === 'November' && <ContentRightNov />}
                {selectedMonth === 'December' && <ContentRightDes />}
            </div>
        </div>
    </div>
    );
};

export default ChartsAll;
