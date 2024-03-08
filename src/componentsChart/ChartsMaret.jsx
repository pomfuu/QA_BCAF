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

const ChartsMaret = () => {

    const [data] = useState([
        {"name":"Alzre","week1Feb":"1583","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1583","persentaseFeb":"21","role":"manual"},
        {"name":"Khusnul","week1Feb":"1682","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1682","persentaseFeb":"18","role":"auto"},
        {"name":"Izza","week1Feb":"1552","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1552","persentaseFeb":"21","role":"manual"},
        {"name":"Rania","week1Feb":"1456","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1456","persentaseFeb":"19","role":"manual"},
        {"name":"Fajar","week1Feb":"2488","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"2488","persentaseFeb":"26","role":"auto"},
        {"name":"Yuda","week1Feb":"1452","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1452","persentaseFeb":"19","role":"manual"},
        {"name":"Dimas","week1Feb":"1400","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1400","persentaseFeb":"15","role":"auto"},
        {"name":"Gita","week1Feb":"","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"","persentaseFeb":"0","role":"manual"},
        {"name":"Alin","week1Feb":"1900","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1900","persentaseFeb":"20","role":"auto"},
        {"name":"Cindy","week1Feb":"1900","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1900","persentaseFeb":"20","role":"auto"}
    ]);

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
            <div className="row mt-4">
                <div className="col-lg-6 ">
                {data.slice(0, Math.ceil(data.length / 2))
                    .filter(item => item.week1Feb !== null && item.week2Feb !== null && item.week3Feb !== null && item.week4Feb !== null && item.week5Feb !== null)
                    .map((item, index) => {
                        const formattedPercentage = Math.round(parseFloat(item.persentaseFeb));
                        return (
                            <div key={index} className="container-fluid align-items-center">
                                <div className="col-12 mb-2 d-flex align-items-center">
                                    <div className="col-1 text-center">
                                        <img style={{ height: '2.5vw' }} className='img-fluid' src={getRobotImage(item.totalFeb, item.role)} alt="robots" />
                                        <div className='fw-semibold' style={{ fontSize:'0.9rem' }}>
                                            {item.name}
                                        </div>
                                    </div>
                                    <div className='col-10 me-2 text-start rounded-3 ' style={{ backgroundColor: '#D9D9D9', padding: '0.5vw' }}>
                                        <div className="row mx-2 d-flex" style={{ height: '1.7vw' }}>
                                            {item.week1Feb !== "" && renderBars(item.totalFeb, item.week1Feb, '#F86161', item.role)}
                                            {item.week2Feb !== "" && renderBars(item.totalFeb, item.week2Feb, '#FFA336', item.role)}
                                            {item.week3Feb !== "" && renderBars(item.totalFeb, item.week3Feb, '#FFD542', item.role)}
                                            {item.week4Feb !== "" && renderBars(item.totalFeb, item.week4Feb, '#84E44B', item.role)}
                                            {item.week5Feb !== "" && renderBars(item.totalFeb, item.week5Feb, '#60CAC4', item.role)}
                                        </div>
                                    </div>
                                    <div className="col-2 fs-5">                 
                                        <div style={{ fontSize:'0.8rem' }}>
                                            Total: <b>{item.totalFeb}</b>
                                            <p className='fw-bold' style={{ color:'#CF3D3D' }}>{formattedPercentage}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
                </div>
                <div className="col-lg-6">
                {data.slice(Math.ceil(data.length / 2))
                    .filter(item => item.week1Feb !== null && item.week2Feb !== null && item.week3Feb !== null && item.week4Feb !== null && item.week5Feb !== null)
                    .map((item, index) => {
                        const formattedPercentage = Math.round(parseFloat(item.persentaseFeb));
                        return (
                            <div key={index} className="container-fluid align-items-center">
                                <div className="col-12 mb-2 d-flex align-items-center">
                                    <div className="col-1 text-center">
                                        <img style={{ height: '2.5vw' }} className='img-fluid' src={getRobotImage(item.totalFeb, item.role)} alt="robots" />
                                        <div className='fw-semibold' style={{ fontSize:'0.9rem' }}>
                                            {item.name}
                                        </div>
                                    </div>
                                    <div className='col-10 me-2 text-start rounded-3 ' style={{ backgroundColor: '#D9D9D9', padding: '0.5vw' }}>
                                        <div className="row mx-2 d-flex" style={{ height: '1.7vw' }}>
                                            {item.week1Feb !== "" && renderBars(item.totalFeb, item.week1Feb, '#F86161', item.role)}
                                            {item.week2Feb !== "" && renderBars(item.totalFeb, item.week2Feb, '#FFA336', item.role)}
                                            {item.week3Feb !== "" && renderBars(item.totalFeb, item.week3Feb, '#FFD542', item.role)}
                                            {item.week4Feb !== "" && renderBars(item.totalFeb, item.week4Feb, '#84E44B', item.role)}
                                            {item.week5Feb !== "" && renderBars(item.totalFeb, item.week5Feb, '#60CAC4', item.role)}
                                        </div>
                                    </div>
                                    <div className="col-2 fs-5">                 
                                        <div style={{ fontSize:'0.8rem' }}>
                                            Total: <b>{item.totalFeb}</b>
                                            <p className='fw-bold' style={{ color:'#CF3D3D' }}>{formattedPercentage}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
                </div>
            </div>
        </div>
    );
};

function renderBars(total, weekValue, color, role) {
    let goal = 7500;
    if (role === 'auto') {
        goal = 9000;
    }

    const percentage = Math.min((weekValue / goal) * 100, 100);
    const barWidth = goal <= weekValue ? '100px' : `${percentage}%`;

    const tooltipText = `Total: ${weekValue}`;
    
    if (weekValue === null || weekValue === 0){
        return null; 
    } else {
        return (
            <div className="me-1 rounded-2 d-flex flex-column align-items-center justify-content-center" style={{ flex: '1', maxWidth: barWidth, backgroundColor: color, position: 'relative' }}>
                <div className='text-center font2' style={{ fontSize:'0.9vw', lineHeight: '1.7vw', color:'#1e1e1e' }}>{weekValue}</div>
            <div style={{ height: '100%' }}></div> </div>
        );
    }
}

export default ChartsMaret;
