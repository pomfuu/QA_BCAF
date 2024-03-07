/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ContentRight = ({ selectedMonth }) => {
    const fileInputRef = useRef(null);
    const [uploadedImages, setUploadedImages] = useState([]);

    useEffect(() => {
        const storedImages = localStorage.getItem(`uploadedImages_${selectedMonth}`);
        if (storedImages) {
            setUploadedImages(JSON.parse(storedImages));
        }
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

    ContentRight.propTypes = {
        selectedMonth: PropTypes.string.isRequired, 
    };

    return (
        <div>
            <div style={{ backgroundColor: '#1e1e1e' }} className="text-white font2 rounded-2 px-4 py-1 fs-5">THIS MONTH GALLERY</div>
            <div className="lightbox">
                <div className="row mt-2">
                    {uploadedImages.map((image, index) => (
                        <div key={index} className="col-lg-6 col-12 position-relative"
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
                <div className="btn rounded-2 text-white px-5 py-1" style={{ backgroundColor: '#CF3D3D' }} onClick={() => fileInputRef.current.click()}>Add Image</div>
            )}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
            <div style={{ backgroundColor: '#1e1e1e' }} className="text-white font2 rounded-2  mt-2 px-4 py-1 fs-5">{selectedMonth} ACHIEVEMENTS</div>
            <div className='mt-2'>
                <Table hover>
                    <thead className='text-center'>
                        <tr>
                            <th className='text-white' style={{ backgroundColor:'#1E1E1E' }}>Week 1</th>
                            <th className='text-white' style={{ backgroundColor:'#1E1E1E' }}>Week 2</th>
                            <th className='text-white' style={{ backgroundColor:'#1E1E1E' }}>Week 3</th>
                            <th className='text-white' style={{ backgroundColor:'#1E1E1E' }}>Week 4</th>
                            <th className='text-white' style={{ backgroundColor:'#1E1E1E' }}>Week 5</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        <tr>
                            <td>70%</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <div className="row align-items-top">
                <div className="col-3 fw-semibold fs-5">
                    WIG
                </div>
                <div className="col-9">
                    pencapaian SLA penyelesaian project dari 75% ke 90%
                </div>
                <div className="col-3 fw-semibold fs-5 mt-2">
                    LEAD
                </div>
                <div className="col-9 mt-2">
                    1800 QA Otomasi <br />
                    1500 QA Manual
                </div>
            </div>
        </div>
    );
}

export default ContentRight;
