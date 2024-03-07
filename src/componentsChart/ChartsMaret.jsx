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
        {"name":"Alzre","week1Feb":"1583","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1583","persentaseFeb":"","role":"manual"},
        {"name":"Khusnul","week1Feb":"1682","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1682","persentaseFeb":"","role":"auto"},
        {"name":"Izza","week1Feb":"1552","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1552","persentaseFeb":"","role":"manual"},
        {"name":"Rania","week1Feb":"1456","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1456","persentaseFeb":"","role":"manual"},
        {"name":"Fajar","week1Feb":"2488","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"2488","persentaseFeb":"","role":"auto"},
        {"name":"Yuda","week1Feb":"1452","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1452","persentaseFeb":"","role":"manual"},
        {"name":"Dimas","week1Feb":"1400","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1400","persentaseFeb":"","role":"auto"},
        {"name":"Gita","week1Feb":"","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"","persentaseFeb":"","role":"manual"},
        {"name":"Alin","week1Feb":"1900","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1900","persentaseFeb":"","role":"auto"},
        {"name":"Cindy","week1Feb":"1900","week2Feb":"","week3Feb":"","week4Feb":"","week5Feb":"","totalFeb":"1900","persentaseFeb":"","role":"auto"}
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
            {data.map((item, index) => (
                <div key={index} className="container-fluid">
                    <div className="row mb-2 d-flex align-items-center">
                        <div className="col-1 text-end">
                            <img style={{ height: '3vw' }} className='img-fluid' src={getRobotImage(item.totalFeb, item.role)} alt="robots" />
                        </div>
                        <div className='col-9 text-start rounded-3' style={{ backgroundColor: '#D9D9D9', padding: '0.5vw' }}>
                            <div className="row mx-2 d-flex">
                                {renderBars(item.totalFeb, item.week1Feb, '#CF3D3D', item.role)}
                                {renderBars(item.totalFeb, item.week2Feb, '#EA8208', item.role)}
                                {renderBars(item.totalFeb, item.week3Feb, '#FFC90C', item.role)}
                                {renderBars(item.totalFeb, item.week4Feb, '#83EC44', item.role)}
                                {renderBars(item.totalFeb, item.week5Feb, '#4CBE08', item.role)}
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
            <div className='col align-items-center d-flex mt-4'>
                <div className="col-1 me-4 font2 fs-5 ms-2">INDICATOR</div>
                <div className="col-2 font2 text-white rounded-2 me-2 btn fs-5" style={{ backgroundColor: '#CF3D3D' }}>WEEK 1</div>
                <div className="col-2 font2 text-white rounded-2 me-2 btn fs-5" style={{ backgroundColor: '#EA8208' }}>WEEK 2</div>
                <div className="col-2 font2 text-white rounded-2 me-2 btn fs-5" style={{ backgroundColor: '#FFC90C' }}>WEEK 3</div>
                <div className="col-2 font2 text-white rounded-2 me-2 btn fs-5" style={{ backgroundColor: '#83EC44' }}>WEEK 4</div>
                <div className="col-2 font2 text-white rounded-2 me-2 btn fs-5" style={{ backgroundColor: '#4CBE08' }}>WEEK 5</div>
            </div>
            <div className='col align-items-center d-flex mt-4'>
                <div className="col-1 me-4 font2 fs-5 ms-2">Note</div>
                <div className="col-10 text-start">Each bar contains 400 steps (manual) and 480 steps (automation)</div>
            </div>
        </div>
    );
};
function renderBars(total, weekValue, color, role) {
  let threshold = 375; // Default threshold
  if (role === 'auto') {
    threshold = 450; // Threshold for 'auto' role
  }
  const maxBars = 20;
  const bars = [];
  const numBars = Math.min(Math.floor(weekValue / threshold), maxBars);

  for (let i = 0; i < numBars; i++) {
    const barWidth = weekValue >= threshold ? '38px' : '10px';
    const tooltipText = `Total: ${weekValue}`;
    bars.push(
      <div key={i} className="py-4 me-1 mb-1 rounded-2" style={{ width: barWidth, backgroundColor: color, position: 'relative' }}>
        <div className="tooltip font2 fs-5 px-5">{tooltipText}</div>
      </div>
    );
  }
  return bars;
}

export default ChartsMaret;
