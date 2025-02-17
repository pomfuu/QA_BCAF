/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { doc, updateDoc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import ImageCompressor from 'image-compressor.js';
import db from '../firebaseconfig.js';
import imageCompression from 'browser-image-compression';

const ContentRightNov = ({ selectedMonth }) => {
    const fileInputRef = useRef(null);
    const [uploadedImages, setUploadedImages] = useState(() => {
        const storedImages = localStorage.getItem(`uploadedImages_${selectedMonth}`);
        return storedImages ? JSON.parse(storedImages) : [];
    });
    const [weekData, setWeekData] = useState({
        week1: '',
        week2: '',
        week3: '',
        week4: '',
        week5: '',
        totalWeek: ''
    });

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, selectedMonth, 'weeksData');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setWeekData(data);
                    setUploadedImages(data.uploadedImages || []);
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

    const compressImage = async (file) => {
        try {
            const options = {
                maxSizeMB: 0.2, 
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Error compressing image:', error);
            throw error;
        }
    };

    const compressAndConvertToJPG = (file, quality) => {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
    
                canvas.toBlob((blob) => {
                    resolve(new File([blob], 'image.jpg', { type: 'image/jpeg' }));
                }, 'image/jpeg', quality);
            };
            img.onerror = (error) => {
                reject(error);
            };
            const URL = window.URL || window.webkitURL;
            img.src = URL.createObjectURL(file);
        });
    };
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const compressedFile = await compressImage(file);
                const reader = new FileReader();
                reader.onload = () => {
                    const newImages = [...uploadedImages, reader.result];
                    setUploadedImages(newImages);
                    localStorage.setItem(`uploadedImages_${selectedMonth}`, JSON.stringify(newImages));
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Error compressing and uploading image:', error);
            }
        }
    };

    const updateFirestoreImages = async (images) => {
        try {
            const docRef = doc(db, selectedMonth, 'weeksData');
            await updateDoc(docRef, { uploadedImages: images });
            console.log('Images updated in Firestore.');
        } catch (error) {
            console.error('Error updating images in Firestore:', error);
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
            updateFirestoreImages(uploadedImages);
            console.log('Week data and images saved successfully.');
            setShowModal(false);
        } catch (error) {
            console.error('Error updating week data:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    ContentRightNov.propTypes = {
        selectedMonth: PropTypes.string.isRequired,
    };

    

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-lg-7 col-12 align-items-center">
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
                        <div className="btn rounded-2 text-white font2 me-1" style={{ backgroundColor: '#F86161' }} onClick={() => fileInputRef.current.click()}>Add Image</div>
                    )}
                    <Button className='border-0 font2 px-4' style={{ backgroundColor:'#00BDB2' }} onClick={handleShowModal}>Save</Button>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
                </div>
                <div className="col-lg-5">
                    <div style={{ backgroundColor: '#00BDB2' }} className="text-white font2 rounded-2 px-4 py-1">NOVEMBER ACHIEVEMENTS</div>
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
                    <Button className='border-0 font2 px-4' style={{ backgroundColor:'#00BDB2' }} onClick={handleShowModal}>Save</Button>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Save Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to save the changes?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContentRightNov;

