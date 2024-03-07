import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

const InputContent = () => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
    const names = ["Alin", "Alzre", "Cindy", "Dimas", "Fajar", "Gita", "Izza", "Khusnul", "Rania", "Yuda"];
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    // State for managing table data
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedWeek, setSelectedWeek] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [steps, setSteps] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    // Function to handle input modal submission
    const handleInputSubmit = () => {
        // Validate input
        if (!selectedMonth || !selectedWeek || !selectedName || !steps || isNaN(steps)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const newEntry = {
            name: selectedName,
            month: selectedMonth,
            week: selectedWeek,
            steps: parseInt(steps),
        };

        if (editIndex !== null) {
            // Edit existing entry
            setTableData(prevData => {
                const newData = prevData.map((entry, index) =>
                    index === editIndex ? { ...entry, ...newEntry } : entry
                );
                return newData;
            });
            setEditIndex(null);
        } else {
            // Add new entry
            setTableData(prevData => [...prevData, { ...newEntry }]);
        }

        // Reset input values and close modal
        setSelectedMonth('');
        setSelectedWeek('');
        setSelectedName('');
        setSteps('');
        setShowModal(false);
    };

    // Handle edit entry
    const handleEdit = (index) => {
        setSelectedMonth(tableData[index].month);
        setSelectedWeek(tableData[index].week);
        setSelectedName(tableData[index].name);
        setSteps(tableData[index].steps);
        setEditIndex(index);
        setShowModal(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirmation = (index) => {
        setDeleteIndex(index);
        setShowConfirm(true);
    };

    // Confirm deletion
    const handleConfirmDelete = () => {
        setTableData(prevData => {
            const newData = prevData.filter((entry, i) => i !== deleteIndex);
            return newData;
        });
        setShowConfirm(false);
        setDeleteIndex(null);
    };

    // Cancel deletion
    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteIndex(null);
    };

    // Handle delete entry
    const handleDelete = (index) => {
        handleDeleteConfirmation(index); // Show confirmation first
    };

    return (
        <div>
            <button style={{
                width: '165px',
                height: '40px',
                backgroundColor: '#83EC44',
                color: '#EEEDE6',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
                transition: 'background-color 0.3s, color 0.3s',
                marginBottom: '20px',

            }}
                className='font2'

                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#DAD6CA';
                    e.target.style.color = '#1E1E1E';
                }} // Change background color on hover

                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#83EC44';
                    e.target.style.color = '#EEEDE6';
                }} // Change background color on hover
                onClick={() => setShowModal(true)}>Add Entry</button>

            {/* Input Modal */}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton style={{
                    backgroundColor: '#F8F7F4',
                }}>
                    <Modal.Title>{editIndex !== null ? 'Edit Entry' : 'Add Entry'}</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ backgroundColor: '#F8F7F4' }}>
                    <label className='font2'>Choose Month</label>
                    <select className="form-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                        <option value="">Choose Month</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>

                    <label className="font2">Choose Week</label>
                    <select className="form-select" value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)}>
                        <option value="">Choose Week</option>
                        {weeks.map((week, index) => (
                            <option key={index} value={week}>{week}</option>
                        ))}
                    </select>

                    <label className="font2">Name</label>
                    <select className="form-select" value={selectedName} onChange={e => setSelectedName(e.target.value)}>
                        <option value="">Name</option>
                        {names.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>

                    <label className='font2'>Steps</label>
                    <input type="number" className="form-control" value={steps} onChange={e => setSteps(e.target.value)} />
                </Modal.Body>

                <Modal.Footer
                    style={{
                        backgroundColor: '#F8F7F4',
                    }}>
                    <Button variant="secondary"
                        style={{
                            backgroundColor: '#DAD6CA',
                            outline: 'none',
                            border: 'none',
                            color: '#1E1E1E'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#DAD6CA';
                            e.target.style.color = '#EEEDE6';
                        }} // Change background color on hover

                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#DAD6CA';
                            e.target.style.color = '#1E1E1E';
                        }}

                        onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary"
                        style={{
                            backgroundColor: '#83EC44',
                            outline: 'none',
                            border: 'none',
                            color: '#1E1E1E'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#83EC44';
                            e.target.style.color = '#EEEDE6';
                        }} // Change background color on hover

                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#83EC44';
                            e.target.style.color = '#1E1E1E';
                        }}
                        onClick={handleInputSubmit}>{editIndex !== null ? 'Update' : 'Submit'}</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showConfirm} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>hapus</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Table */}
            <Table striped bordered>
                <thead >
                    <tr className="align-middle text-center font2" style={{ height: '50px' }}>
                        <th style={{ width: '20%' }}>Name</th>
                        <th style={{ width: '15%' }}>Month</th>
                        <th style={{ width: '15%' }}>Week</th>
                        <th style={{ width: '15%' }}>Steps</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((entry, index) => (
                        <tr key={index} className="align-middle text-center" style={{ height: '50px' }}>
                            <td>{entry.name}</td>
                            <td>{entry.month}</td>
                            <td>{entry.week}</td>
                            <td>{entry.steps}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => handleEdit(index)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default InputContent;
