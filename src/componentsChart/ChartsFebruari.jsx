/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const ChartsFebruari = () => {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);
    const [data, setData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('https://api.sheety.co/a5cda160b024727716dd2e21fdf3df88/qaDashboard/sheet1');
    //             const newData = response.data.sheet1 || [];
    //             setData(newData);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    //     return () => {
    //         if (chartInstance.current !== null) {
    //             chartInstance.current.destroy();
    //         }
    //     };
    // }, []);

    // useEffect(() => {
    //     if (chartInstance.current !== null) {
    //         chartInstance.current.destroy();
    //     }
    
    //     if (chartContainer && chartContainer.current) {
    //         const ctx = chartContainer.current.getContext('2d');
    //         const sortedData = data.slice().sort((a, b) => parseFloat(b.totalFeb) - parseFloat(a.totalFeb));
        
    //         chartInstance.current = new Chart(ctx, {
    //             type: 'bar',
    //             data: {
    //                 labels: sortedData.map(entry => entry.name || 'No Data'),
    //                 datasets: [{
    //                     axis: 'y',
    //                     label: 'Total',
    //                     data: sortedData.map(entry => parseFloat(entry.totalFeb) || 0),
    //                     fill: false,
    //                     backgroundColor: sortedData.map(entry => {
    //                         const total = parseFloat(entry.totalFeb);
    //                         if (total < 5000) {
    //                             return '#083344';
    //                         } else if (total >= 5000 && total < 7000) {
    //                             return '#0e7490';
    //                         } else if (total >= 7000 && total < 9000) {
    //                             return '#0891b2';
    //                         } else {
    //                             return '#22d3ee';
    //                         }
    //                     }),
    //                     borderWidth: 1
    //                 }]
    //             },
    //             options: {
    //                 indexAxis: 'y'
    //             }
    //         });
    //     }
    // }, [data]);

    return (
        <div className='mt-5'>
            <div className="container-fluid">
                <div className="row d-flex">
                    <div className="col-2"><img style={{ height:'3.5vw' }} className='img-fluid' src="../../public/Assets/robot_4.svg" alt="robots" /></div>
                    <div className='col-6 text-start rounded-2' style={{ backgroundColor:'#D9D9D9'}}>helo</div>
                    <div className="col-4">name</div>
                </div>
            </div>
        </div>
    );
};

export default ChartsFebruari;
