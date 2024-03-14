/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Charts.css';
import robot1 from '../../public/Assets/robot_1.svg';
import robot2 from '../../public/Assets/robot_2.svg';
import robot3 from '../../public/Assets/robot_3.svg';
import robot4 from '../../public/Assets/robot_4.svg';
import robot5 from '../../public/Assets/robot_5.svg';
import robot6 from '../../public/Assets/robot_6.svg';
import db from '../firebaseconfig.js';
import { collection, getDocs, getDoc, doc } from '@firebase/firestore';

const ChartsJuni = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchDataFromFirestore = async () => {
            try {
                const februarySummaryDocRef = doc(db, 'summary', 'June');
                const februarySummaryDocSnapshot = await getDoc(februarySummaryDocRef);
        
                if (februarySummaryDocSnapshot.exists()) {
                    const februarySummaryData = februarySummaryDocSnapshot.data();
                    const autoData = [];
                    const manualData = [];
                    Object.keys(februarySummaryData.data).forEach(name => {
                        const role = ['Alin', 'Cindy', 'Daniel', 'Dimas', 'Khusnul', 'Fajar', 'Jerry'].includes(name) ? 'auto' : 'manual';
                        const weeks = februarySummaryData.data[name].weeks;
                        const weekSteps = {
                            'Week 1': weeks['Week 1'] ? weeks['Week 1'].steps : 0,
                            'Week 2': weeks['Week 2'] ? weeks['Week 2'].steps : 0,
                            'Week 3': weeks['Week 3'] ? weeks['Week 3'].steps : 0,
                            'Week 4': weeks['Week 4'] ? weeks['Week 4'].steps : 0,
                            'Week 5': weeks['Week 5'] ? weeks['Week 5'].steps : 0,
                        };
                        const item = {
                            name,
                            role,
                            week: weekSteps
                        };
                        if (role === 'auto') {
                            autoData.push(item);
                        } else {
                            manualData.push(item);
                        }
                    });
                    manualData.sort((a, b) => {
                        if (a.name === 'Gita') return 1;
                        if (b.name === 'Gita') return -1;
                        return a.name.localeCompare(b.name);
                    });
                    const newData = autoData.concat(manualData);
                    setData(newData);
                } else {
                    console.error('Document for February does not exist in Firestore.');
                }
            } catch (error) {
                console.error('Error fetching data from Firestore:', error);
            }
        };
        fetchDataFromFirestore();
    }, []);
    
    const getRobotImage = (total, role) => {
        let target = 5700;
        let robotImg = robot1;

        if (role === 'auto') {
            target = 6840;
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
        let goalVal = 5700;
        if (role === 'auto') {
            goalVal = 6840;
        }
        return goalVal;
    }

    return (
        <div>
            <div className="row mt-4">
                <div className="col-lg-6 ">
                {data
                    .filter(item => item.role === 'auto' && (item.week !== null || item.week2Feb !== null || item.week3Feb !== null || item.week4Feb !== null || item.week5Feb !== null))
                    .map((item, index) => {
                        let week1 = item.week && item.week['Week 1'] ? item.week['Week 1'] : null;
                        let week2 = item.week && item.week['Week 2'] ? item.week['Week 2'] : null;
                        let week3 = item.week && item.week['Week 3'] ? item.week['Week 3'] : null;
                        let week4 = item.week && item.week['Week 4'] ? item.week['Week 4'] : null;
                        let week5 = item.week && item.week['Week 5'] ? item.week['Week 5'] : null;
    
                        const totalFeb = (
                            (item.week && item.week['Week 1'] ? parseInt(item.week['Week 1']) : 0) +
                            (item.week && item.week['Week 2'] ? parseInt(item.week['Week 2']) : 0) +
                            (item.week && item.week['Week 3'] ? parseInt(item.week['Week 3']) : 0) +
                            (item.week && item.week['Week 4'] ? parseInt(item.week['Week 4']) : 0) +
                            (item.week && item.week['Week 5'] ? parseInt(item.week['Week 5']) : 0)
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
                                            {week1 > 0 && renderBars(totalFeb, week1, '#F86161', item.role)}
                                            {week2 > 0 && renderBars(totalFeb, week2, '#FFA336', item.role)}
                                            {week3 > 0 && renderBars(totalFeb, week3, '#FFD542', item.role)}
                                            {week4 > 0 && renderBars(totalFeb, week4, '#84E44B', item.role)}
                                            {week5 > 0 && renderBars(totalFeb, week5, '#60CAC4', item.role)}
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
                {data
                    .filter(item => item.role === 'manual' && (item.week !== null || item.week2Feb !== null || item.week3Feb !== null || item.week4Feb !== null || item.week5Feb !== null))
                    .map((item, index) => {
                        const week1 = item.week && item.week['Week 1'] ? item.week['Week 1'] : 0;
                        let week2 = item.week && item.week['Week 2'] ? item.week['Week 2'] : null;
                        let week3 = item.week && item.week['Week 3'] ? item.week['Week 3'] : null;
                        let week4 = item.week && item.week['Week 4'] ? item.week['Week 4'] : null;
                        let week5 = item.week && item.week['Week 5'] ? item.week['Week 5'] : null;
    
                        const totalFeb = (
                            (item.week && item.week['Week 1'] ? parseInt(item.week['Week 1']) : 0) +
                            (item.week && item.week['Week 2'] ? parseInt(item.week['Week 2']) : 0) +
                            (item.week && item.week['Week 3'] ? parseInt(item.week['Week 3']) : 0) +
                            (item.week && item.week['Week 4'] ? parseInt(item.week['Week 4']) : 0) +
                            (item.week && item.week['Week 5'] ? parseInt(item.week['Week 5']) : 0)
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
                                            {week1 > 0 && renderBars(totalFeb, week1, '#F86161', item.role)}
                                            {week2 > 0 && renderBars(totalFeb, week2, '#FFA336', item.role)}
                                            {week3 > 0 && renderBars(totalFeb, week3, '#FFD542', item.role)}
                                            {week4 > 0 && renderBars(totalFeb, week4, '#84E44B', item.role)}
                                            {week5 > 0 && renderBars(totalFeb, week5, '#60CAC4', item.role)}
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
    let goal = 5700;
    if (role === 'auto') {
      goal = 6840;
    }
    
    const parsedWeekValue = parseInt(weekValue, 10);
    const percentage = Math.min((parsedWeekValue / goal) * 100, 100);
    const barWidth = goal <= parsedWeekValue ? '100px' : `${percentage}%`;
    
    return (
      <div className="me-1 rounded-2 d-flex flex-column align-items-center justify-content-center" style={{ flex: '1', maxWidth: barWidth, backgroundColor: color, position: 'relative' }}>
        <div className='text-center font2' style={{ fontSize:'0.9vw', lineHeight: '1.7vw', color:'#1e1e1e' }}>{parsedWeekValue}</div>
        <div style={{ height: '100%' }}></div>
      </div>
    );
}

export default ChartsJuni;
