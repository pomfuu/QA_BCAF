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
import db from '../firebaseconfig.js';
import { collection, getDocs } from '@firebase/firestore';

const ChartsFebruari = () => {
    const [data, setData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('https://sheet.best/api/sheets/2f61bb11-7793-47ec-8ffe-40700b4097e4');
    //             const newData = response.data || [];
    //             setData(newData);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        const fetchDataFromFirestore = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'entries'));
                const newData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(newData); 
            } catch (error) {
                console.error('Error fetching data from Firestore:', error);
            }
        };

        fetchDataFromFirestore(); // Fetch data when the component mounts
    }, []);

    const getRobotImage = (total, role) => {
        let target = 7500;
        let robotImg = robot1;

        if (role === 'auto') {
            target = 9000;
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

    const goal = (role) => {
        let goalVal = 7500;
        if (role === 'auto') {
            goalVal = 9000;
        }
        return goalVal;
    }

    return (
        <div>
            <div className="row mt-4">
                <div className="col-lg-6 ">
                {data.slice(0, Math.ceil(data.length / 2))
                    .filter(item => item.week1Feb !== null && item.week2Feb !== null && item.week3Feb !== null && item.week4Feb !== null && item.week5Feb !== null)
                    .map((item, index) => {
                        const totalFeb = (
                            (item.week1Feb !== "" ? parseInt(item.week1Feb) : 0) +
                            (item.week2Feb !== "" ? parseInt(item.week2Feb) : 0) +
                            (item.week3Feb !== "" ? parseInt(item.week3Feb) : 0) +
                            (item.week4Feb !== "" ? parseInt(item.week4Feb) : 0) +
                            (item.week5Feb !== "" ? parseInt(item.week5Feb) : 0)
                        );
                        const goalVal = goal(item.role)
                        const persentase = (totalFeb/goalVal) * 100
                        const formattedPercentage = Math.round(parseFloat(persentase));
                        return (
                            <div key={index} className="container-fluid align-items-center">
                                <div className="col-12 mb-2 d-flex align-items-center">
                                    <div className="col-1 text-center">
                                        <img style={{ height: '2.5vw' }} className='img-fluid' src={getRobotImage(totalFeb, item.role)} alt="robots" />
                                        <div className='fw-semibold' style={{ fontSize:'0.9rem' }}>
                                            {item.name}
                                        </div>
                                    </div>
                                    <div className='col-10 me-2 text-start rounded-3 ' style={{ backgroundColor: '#D9D9D9', padding: '0.5vw' }}>
                                        <div className="row mx-2 d-flex" style={{ height: '1.7vw' }}>
                                            {item.week1Feb !== "" && renderBars(totalFeb, item.week1Feb, '#F86161', item.role)}
                                            {item.week2Feb !== "" && renderBars(totalFeb, item.week2Feb, '#FFA336', item.role)}
                                            {item.week3Feb !== "" && renderBars(totalFeb, item.week3Feb, '#FFD542', item.role)}
                                            {item.week4Feb !== "" && renderBars(totalFeb, item.week4Feb, '#84E44B', item.role)}
                                            {item.week5Feb !== "" && renderBars(totalFeb, item.week5Feb, '#60CAC4', item.role)}
                                        </div>
                                    </div>
                                    <div className="col-2 fs-5">                 
                                        <div style={{ fontSize:'0.8rem' }}>
                                            Total: <b>{totalFeb}</b>
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
                        const totalFeb = (
                            (item.week1Feb !== "" ? parseInt(item.week1Feb) : 0) +
                            (item.week2Feb !== "" ? parseInt(item.week2Feb) : 0) +
                            (item.week3Feb !== "" ? parseInt(item.week3Feb) : 0) +
                            (item.week4Feb !== "" ? parseInt(item.week4Feb) : 0) +
                            (item.week5Feb !== "" ? parseInt(item.week5Feb) : 0)
                        );
                        const goalVal = goal(item.role) 
                        const persentase = (totalFeb/goalVal) * 100
                        const formattedPercentage = Math.round(parseFloat(persentase));
                        return (
                            <div key={index} className="container-fluid align-items-center">
                                <div className="col-12 mb-2 d-flex align-items-center">
                                    <div className="col-1 text-center">
                                        <img style={{ height: '2.5vw' }} className='img-fluid' src={getRobotImage(totalFeb, item.role)} alt="robots" />
                                        <div className='fw-semibold' style={{ fontSize:'0.9rem' }}>
                                            {item.name}
                                        </div>
                                    </div>
                                    <div className='col-10 me-2 text-start rounded-3 ' style={{ backgroundColor: '#D9D9D9', padding: '0.5vw' }}>
                                        <div className="row mx-2 d-flex" style={{ height: '1.7vw' }}>
                                            {item.week1Feb !== "" && renderBars(totalFeb, item.week1Feb, '#F86161', item.role)}
                                            {item.week2Feb !== "" && renderBars(totalFeb, item.week2Feb, '#FFA336', item.role)}
                                            {item.week3Feb !== "" && renderBars(totalFeb, item.week3Feb, '#FFD542', item.role)}
                                            {item.week4Feb !== "" && renderBars(totalFeb, item.week4Feb, '#84E44B', item.role)}
                                            {item.week5Feb !== "" && renderBars(totalFeb, item.week5Feb, '#60CAC4', item.role)}
                                        </div>
                                    </div>
                                    <div className="col-2 fs-5">                 
                                        <div style={{ fontSize:'0.8rem' }}>
                                            Total: <b>{totalFeb}</b>
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

export default ChartsFebruari;
