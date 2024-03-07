/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Charts.css'
import robot1 from '../../public/Assets/robot_1.svg';
import robot2 from '../../public/Assets/robot_2.svg';
import robot3 from '../../public/Assets/robot_3.svg';
import robot4 from '../../public/Assets/robot_4.svg';
import robot5 from '../../public/Assets/robot_5.svg';
import robot6 from '../../public/Assets/robot_6.svg';

const ChartsFebruari = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://sheetdb.io/api/v1/4e6szdqjrrcnp');
                const newData = response.data || [];
                setData(newData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getRobotImage = (total, role) => {
        let target = 6000;
        let robotImg = robot1;

        if (role === 'auto') {
            target = 7200;
        }

        const percentage = (total / target) * 100;

        if (percentage >= 100) {
            robotImg = robot6;
        } else if (percentage >= 61) {
            robotImg = robot5;
        } else if (percentage >= 41) {
            robotImg = robot4;
        } else if (percentage >= 21) {
            robotImg = robot3;
        } else if (percentage >= 1) {
            robotImg = robot2;
        }

        return robotImg;
    };

    return (
        <div>
            {data.map((item, index) => (
                <div key={index} className="container-fluid">
                    <div className="row mb-2 d-flex align-items-center">
                        <div className="col-1 text-end">
                            <img style={{ height: '3vw' }} className='img-fluid' src={getRobotImage(item.totalFeb, item.role)} alt="robots" />
                        </div>
                        <div className='col-9 text-start rounded-3' style={{ backgroundColor: '#D9D9D9', padding: '0.5vw' }}>
                            <div className="row mx-2 d-flex">
                                {item.week1Feb !== 0 && renderBars(item.totalFeb, item.week1Feb, '#CF3D3D', item.role)}
                                {item.week2Feb !== 0 && renderBars(item.totalFeb, item.week2Feb, '#EA8208', item.role)}
                                {item.week3Feb !== 0 && renderBars(item.totalFeb, item.week3Feb, '#FFC90C', item.role)}
                                {item.week4Feb !== 0 && renderBars(item.totalFeb, item.week4Feb, '#83EC44', item.role)}
                                {item.week5Feb !== 0 && renderBars(item.totalFeb, item.week5Feb, '#4CBE08', item.role)}
                            </div>
                        </div>
                        <div className="col-2 fs-5">
                            <div className='fw-semibold'>
                                {item.name}
                            </div>
                            <div>
                                Total: {item.totalFeb}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

function renderBars(total, weekValue, color, role) {
    let goal = 6000;
    if (role === 'auto') {
        goal = 7200;
    }

    const percentage = Math.min((weekValue / goal) * 100, 100);
    const barWidth = `${percentage}%`;

    const tooltipText = `Total: ${weekValue}`;
    
    if (weekValue !== null || weekValue !== 0){
        return (
            <div className="py-4 me-1 mb-1 rounded-2" style={{ width: barWidth, backgroundColor: color, position: 'relative' }}>
                <div className="tooltip font2 fs-5 px-5">{tooltipText}</div>
            </div>
        );
    }
}

export default ChartsFebruari;
