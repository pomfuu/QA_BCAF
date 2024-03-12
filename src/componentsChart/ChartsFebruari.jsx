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

    useEffect(() => {
        const fetchDataFromFirestore = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'entries'));
                const newData = [];
                querySnapshot.docs.forEach(doc => {
                    const entry = doc.data();
                    // Check if the entry is for the selected month (February)
                    if (entry.month === "February") {
                        // Convert steps to string
                        const totalSteps = String(entry.steps);
                    
                        // Add totalSteps to entry object
                        entry.totalSteps = totalSteps;
                    
                        // Check if there is already an entry for this person
                        const existingEntryIndex = newData.findIndex(item => item.name === entry.name);
                        if (existingEntryIndex === -1) {
                            // If no entry exists, add it to newData
                            newData.push(entry);
                        } else {
                            // If an entry exists, update it if needed (e.g., get the value for each week)
                            const existingEntry = newData[existingEntryIndex];
                            const week = entry.week.toLowerCase().replace(/\s/g, ''); // Convert week string to lowercase and remove spaces
                            existingEntry[`week${week}Feb`] = entry.notes; // Dynamically assign the property name
                            existingEntry.totalSteps += totalSteps; // Update total steps
                        }
                    }
                });
                setData(newData);
            } catch (error) {
                console.error('Error fetching data from Firestore:', error);
            }
        };
    
        fetchDataFromFirestore(); 
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
                    .filter(item => item.week !== null || item.week2Feb !== null || item.week3Feb !== null || item.week4Feb !== null || item.week5Feb !== null)
                    .map((item, index) => {
                        const week1 = item.week === 'Week 1' ? item.steps : null;
                        const week2 = item.week === 'Week 2' ? item.steps : null;
                        const week3 = item.week === 'Week 3' ? item.steps : null;
                        const week4 = item.week === 'Week 4' ? item.steps : null;
                        const week5 = item.week === 'Week 5' ? item.steps : null;

                        const totalFeb = (
                            (item.week === 'Week 1' ? parseInt(item.steps) : 0) +
                            (item.week === 'Week 2' ? parseInt(item.steps) : 0) +
                            (item.week === 'Week 3' ? parseInt(item.steps) : 0) +
                            (item.week === 'Week 4' ? parseInt(item.steps) : 0) +
                            (item.week === 'Week 5' ? parseInt(item.steps) : 0)
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
                                            {item.week !== "" && item.week === 'Week 1' && renderBars(totalFeb, item.steps, '#F86161', item.role)}
                                            {item.week !== "" && item.week === 'Week 2' && renderBars(totalFeb, item.steps, '#FFA336', item.role)}
                                            {item.week !== "" && item.week === 'Week 3' && renderBars(totalFeb, item.steps, '#FFD542', item.role)}
                                            {item.week !== "" && item.week === 'Week 4' && renderBars(totalFeb, item.steps, '#84E44B', item.role)}
                                            {item.week !== "" && item.week === 'Week 5' && renderBars(totalFeb, item.steps, '#60CAC4', item.role)}
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
                    .filter(item => item.week !== null)
                    .map((item, index) => {
                        const totalFeb = (
                            (item.week === 'Week 1' ? parseInt(item.steps) : 0) +
                            (item.week === 'Week 2' ? parseInt(item.steps) : 0) +
                            (item.week === 'Week 3' ? parseInt(item.steps) : 0) +
                            (item.week === 'Week 4' ? parseInt(item.steps) : 0) +
                            (item.week === 'Week 5' ? parseInt(item.steps) : 0)
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
                                            {item.week !== "" && item.week === 'Week 1' && renderBars(totalFeb, item.steps, '#F86161', item.role)}
                                            {item.week !== "" && item.week === 'Week 2' && renderBars(totalFeb, item.steps, '#FFA336', item.role)}
                                            {item.week !== "" && item.week === 'Week 3' && renderBars(totalFeb, item.steps, '#FFD542', item.role)}
                                            {item.week !== "" && item.week === 'Week 4' && renderBars(totalFeb, item.steps, '#84E44B', item.role)}
                                            {item.week !== "" && item.week === 'Week 5' && renderBars(totalFeb, item.steps, '#60CAC4', item.role)}
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
  
    // Remove the following conditional statement
    // if (isNaN(weekValue) || weekValue === "") {
    //   console.log("isNaN or empty string"); // Log if weekValue is NaN or empty string
    //   // If it's NaN or an empty string, return null or any other placeholder
    //   return null;
    // }
  
    const parsedWeekValue = parseInt(weekValue, 10); // Parse weekValue as an integer
    // console.log("parsedWeekValue:", parsedWeekValue); // Log parsedWeekValue to see if it's a valid number
  
    const percentage = Math.min((parsedWeekValue / goal) * 100, 100);
    const barWidth = goal <= parsedWeekValue ? '100px' : `${percentage}%`;
  
    const tooltipText = `Total: ${parsedWeekValue}`;
    
    return (
      <div className="me-1 rounded-2 d-flex flex-column align-items-center justify-content-center" style={{ flex: '1', maxWidth: barWidth, backgroundColor: color, position: 'relative' }}>
        <div className='text-center font2' style={{ fontSize:'0.9vw', lineHeight: '1.7vw', color:'#1e1e1e' }}>{parsedWeekValue}</div>
        <div style={{ height: '100%' }}></div>
      </div>
    );
  }

export default ChartsFebruari;
