/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Image, Table } from "react-bootstrap";

const TableFebruary = () => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.sheety.co/a5cda160b024727716dd2e21fdf3df88/qaDashboard/sheet1');
                const data = response.data.sheet1;
    
                // Check if data is an array
                if (Array.isArray(data)) {
                    const febData = data.map(entry => ({
                        Name: entry.name || 'No Data',
                        Week1: entry.week1Feb !== "0" && entry.week1Feb ? entry.week1Feb : '',
                        Week2: entry.week2Feb !== "0" && entry.week2Feb ? entry.week2Feb : '',
                        Week3: entry.week3Feb !== "0" && entry.week3Feb ? entry.week3Feb : '',
                        Week4: entry.week4Feb !== "0" && entry.week4Feb ? entry.week4Feb : '',
                        Week5: entry.week5Feb !== "0" && entry.week5Feb ? entry.week5Feb : '',
                        Total: entry.totalFeb !== "0" && entry.totalFeb ? entry.totalFeb.toFixed(0) : '',
                        Percentage: entry.persentaseFeb ? (entry.persentaseFeb * 100).toFixed(0) + '%' : ''
                    }));
    
                    setTableData(febData);
                } else {
                    console.error('Data from API is not in the expected format:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);

    const calculateTotal = (week) => {
        const total = tableData.reduce((acc, curr) => {
            return acc + (parseFloat(curr[week]) || 0);
        }, 0);
        return total / tableData.length;
    };

    return (
        <div>
            <p className='fw-semibold mb-2 mt-4' style={{ fontSize: '1.7vw' }}>February Performance Table</p>
            <Table bordered hover size="sm">
                <thead>
                    <tr>
                        {/* Render column names */}
                        <th>Name</th>
                        <th>Week 1</th>
                        <th>Week 2</th>
                        <th>Week 3</th>
                        <th>Week 4</th>
                        <th>Week 5</th>
                        <th>Total</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.Name}</td>
                            <td>{row.Week1}</td>
                            <td>{row.Week2}</td>
                            <td>{row.Week3}</td>
                            <td>{row.Week4}</td>
                            <td>{row.Week5}</td>
                            <td>{row.Total}</td>
                            <td>{row.Percentage}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className='fw-semibold'>Total</td>
                        <td>{calculateTotal('Week1').toFixed(0)}</td>
                        <td>{calculateTotal('Week2').toFixed(0)}</td>
                        <td>{calculateTotal('Week3').toFixed(0)}</td>
                        <td>{calculateTotal('Week4').toFixed(0)}</td>
                        <td>{calculateTotal('Week5').toFixed(0)}</td>
                        <td>{calculateTotal('Total').toFixed(0)}</td>
                        <td>{calculateTotal('Percentage').toFixed(0) + '%'}</td>
                    </tr>
                </tbody>
            </Table>
            <div className="row gap-2 align-items-center">
                <div className='col-lg-4 col-12'>
                    <img className='img-fluid rounded-2' style={{ objectFit: 'cover', height:'30vh', width: '100%' }} src="/Assets/feb1.png" />
                </div>
                <div className='col-lg-4 col-12'>
                    <img className='img-fluid rounded-2' style={{ objectFit: 'cover', height:'30vh', width: '100%' }} src="/Assets/feb2.png" />
                </div>
            </div>
        </div>
    )
}

export default TableFebruary;


