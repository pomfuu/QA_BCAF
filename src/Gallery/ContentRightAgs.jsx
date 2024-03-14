/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { doc, updateDoc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import db from '../firebaseconfig.js';

const ContentRightAgs = ({ selectedMonth }) => {
    const fileInputRef = useRef(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [weekData, setWeekData] = useState({
        week1: '',
        week2: '',
        week3: '',
        week4: '',
        week5: '',
        totalWeek: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, selectedMonth, 'weeksData');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setWeekData(data);
                } else {
                    await setDoc(docRef, weekData);
                    console.log('Initial week data saved successfully.');
                }
            } catch (error) {
                console.error('Error fetching week data:', error);
            }
        };
        fetchData();
    }, [selectedMonth]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && uploadedImages.length < 5) {
            const reader = new FileReader();
            reader.onload = () => {
                const newImages = [...uploadedImages, reader.result];
                setUploadedImages(newImages);
                localStorage.setItem(`uploadedImages_${selectedMonth}`, JSON.stringify(newImages));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = (index) => {
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages);
        localStorage.setItem(`uploadedImages_${selectedMonth}`, JSON.stringify(updatedImages));
    };

    const handleMouseEnter = (index) => {
        const buttons = document.getElementById(`image-buttons-${index}`);
        if (buttons) {
            buttons.style.display = 'flex';
        }
    };

    const handleMouseLeave = (index) => {
        const buttons = document.getElementById(`image-buttons-${index}`);
        if (buttons) {
            buttons.style.display = 'none';
        }
    };

    const handleWeekDataChange = async (week, value) => {
        try {
            const updatedData = { ...weekData, [week]: value };
            setWeekData(updatedData); 
            const weekDataCollectionRef = collection(db, 'weekDataCollection');
            await addDoc(weekDataCollectionRef, {
                week,
                value,
                timestamp: new Date(),
                month: selectedMonth
            });
            const docRef = doc(db, selectedMonth, 'weeksData');
            await updateDoc(docRef, updatedData);
            console.log('Week data saved successfully.');
        } catch (error) {
            console.error('Error updating week data:', error);
        }
    };

    const handleSaveChanges = async () => {
        try {
            console.log('Saving changes for month:', selectedMonth);
            const docRef = doc(db, selectedMonth, 'weeksData');
            await updateDoc(docRef, weekData);
            console.log('Week data saved successfully.');
        } catch (error) {
            console.error('Error updating week data:', error);
        }
    };

    ContentRightAgs.propTypes = {
        selectedMonth: PropTypes.string.isRequired,
    };

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-lg-7 col-12">
                    <div style={{ backgroundColor: '#00BDB2' }} className="text-white font2 rounded-2 px-4 py-1">THIS MONTH GALLERY</div>
                    <div className="lightbox">
                        <div className="row mt-2">
                            {uploadedImages.map((image, index) => (
                                <div key={index} className="col-lg-3 col-6 position-relative"
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={() => handleMouseLeave(index)}>
                                    <img className="img-fluid rounded-2 w-100 mb-2" src={image} alt="" style={{ objectFit: 'cover', height: '10vw' }} />
                                    <div id={`image-buttons-${index}`} className="image-buttons position-absolute top-50 start-50 translate-middle" style={{ display: 'none' }}>
                                        <div className='btn rounded-2 bg-black text-white' onClick={() => handleDelete(index)}>Delete</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {uploadedImages.length < 5 && (
                        <div className="btn rounded-2 text-white font2 mb-2" style={{ backgroundColor: '#F86161' }} onClick={() => fileInputRef.current.click()}>Add Image</div>
                    )}
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
                </div>
                <div className="col-lg-5">
                    <div style={{ backgroundColor: '#00BDB2' }} className="text-white font2 rounded-2 px-4 py-1">AUGUST ACHIEVEMENTS</div>
                    <div className='mt-2'>
                        <Table size='sm' hover>
                            <thead className='text-center'>
                                <tr>
                                    <th className='text-white' style={{ backgroundColor: '#F86161' }}>Week 1</th>
                                    <th className='text-white' style={{ backgroundColor: '#FFA336' }}>Week 2</th>
                                    <th className='text-white' style={{ backgroundColor: '#FFD542' }}>Week 3</th>
                                    <th className='text-white' style={{ backgroundColor: '#84E44B' }}>Week 4</th>
                                    <th className='text-white' style={{ backgroundColor: '#26D2C7' }}>Week 5</th>
                                    <th className='text-white' style={{ backgroundColor: '#1e1e1e' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                <tr>
                                    <td contentEditable onBlur={(e) => handleWeekDataChange('week1', e.target.innerText)}>{weekData.week1}</td>
                                    <td contentEditable onBlur={(e) => handleWeekDataChange('week2', e.target.innerText)}>{weekData.week2}</td>
                                    <td contentEditable onBlur={(e) => handleWeekDataChange('week3', e.target.innerText)}>{weekData.week3}</td>
                                    <td contentEditable onBlur={(e) => handleWeekDataChange('week4', e.target.innerText)}>{weekData.week4}</td>
                                    <td contentEditable onBlur={(e) => handleWeekDataChange('week5', e.target.innerText)}>{weekData.week5}</td>
                                    <td contentEditable onBlur={(e) => handleWeekDataChange('total', e.target.innerText)}>{weekData.total}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <Button className='border-0 font2 px-4' style={{ backgroundColor:'#00BDB2' }} onClick={handleSaveChanges}>Save</Button>
                </div>
            </div>
        </div>
    );
};

export default ContentRightAgs;
