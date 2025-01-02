/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getDocs, collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { query, orderBy } from 'firebase/firestore';
import Table from 'react-bootstrap/Table';
import db from './firebaseconfig';
import { FaCheck } from 'react-icons/fa';
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaCheckSquare } from "react-icons/fa";
import { FaRegNoteSticky } from "react-icons/fa6";
import './main.css';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const InputContent = () => {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const names = ["Alin", "Alzre", "Cindy", "Daniel", "Dimas", "Fajar", "indri", "Izza", "Khusnul", "Rania", "Yuda", "Alya", "Cindy U", "Adel", "Ave", "Jason", "Thendri", "Novensius", "Andilians"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // State for managing table data
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [steps, setSteps] = useState('');
  const [scenario, setScenario] = useState('');
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmedRows, setConfirmedRows] = useState({}); // Store confirmation status for each row
  const [selectedNote, setSelectedNote] = useState(''); // State for selected note to display in modal

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return tableData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'entries'), orderBy('timestamp', 'desc')));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Update the state with the sorted data
      setTableData(data);

      // Fetch confirmed status from Firestore
      const confirmedData = {};
      data.forEach(entry => {
        confirmedData[entry.id] = entry.confirmed || false;
      });
      setConfirmedRows(confirmedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to handle input modal submission
  const handleInputSubmit = async () => {
    // Validate input
    if (!selectedMonth || !selectedWeek || !selectedName || !steps || isNaN(steps)) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const getRole = (name) => {
      switch (name) {
        case 'Alin':
        case 'Cindy':
        case 'Daniel':
        case 'Dimas':
        case 'Fajar':
        case 'Khusnul':
        case 'Jason':
          case 'Novensius':
            case 'Andilians':
          return 'auto';
        case 'Alzre':
        case 'Indri':
        case 'Izza':
        case 'Rania':
        case 'Yuda':
        case 'Alya':
        case 'Thendri':
          case 'Adel':
            case 'Cindy U':
            case 'Ave':
          return 'manual';
        default:
          return '';
      }
    }

    const newEntry = {
      name: selectedName,
      month: selectedMonth,
      week: selectedWeek,
      steps: parseFloat(steps).toFixed(2),
      confirmed: false,
      timestamp: new Date(),
      scenario: scenario,
      notes: notes,
      role: getRole(selectedName) // Assigning role based on selectedName
    };

    if (editId !== null) {
      // Update existing entry
      try {
        await updateDoc(doc(db, 'entries', editId), newEntry);
        setEditId(null); // Reset editId after updating
      } catch (error) {
        console.error('Error updating entry:', error);
      }
    } else {
      // Add new entry
      try {
        await addDoc(collection(db, 'entries'), newEntry);
      } catch (error) {
        console.error('Error adding entry:', error);
      }
    }

    // Fetch updated data from Firestore
    await fetchData();

    // Reset input values and close modal
    setSelectedMonth('');
    setSelectedWeek('');
    setSelectedName('');
    setSteps('');
    setScenario('');
    setNotes('');
    setShowModal(false);
  };

  const handleCancelSubmit = () => {
    setSelectedMonth('');
    setSelectedWeek('');
    setSelectedName('');
    setSteps('');
    setScenario('');
    setNotes('');
    setShowModal(false);
  }

  const handleEdit = (id) => {
    const entry = tableData.find(entry => entry.id === id);
    setSelectedMonth(entry.month);
    setSelectedWeek(entry.week);
    setSelectedName(entry.name);
    setSteps(entry.steps);
    setScenario(entry.scenario);
    setNotes(entry.notes);
    setShowModal(true);
    setEditId(id); // Set the id of the entry being edited
  };

  const handleDelete = async (id) => {
    try {
      setDeleteId(id); // Set the id of the entry to be deleted
      setShowConfirm(true); // Show the confirmation modal
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'entries', deleteId));
      setShowConfirm(false); // Close the confirmation modal
      // Fetch updated data from Firestore
      await fetchData();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false); // Close the confirmation modal
  };

  const handleConfirmEntry = async (id) => {
    try {
      // Update the confirmed field to true in Firestore
      await updateDoc(doc(db, 'entries', id), { confirmed: true });
      // Update the confirmation status for the specific row in state
      setConfirmedRows(prevState => ({
        ...prevState,
        [id]: true,
      }));
    } catch (error) {
      console.error('Error confirming entry:', error);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleCloseNoteModal = () => {
    setSelectedNote('');
  };

  const [filterMonth, setFilterMonth] = useState('');

  // Function to handle filtering by month
  const handleFilterByMonth = async () => {
    try {
      let querySnapshot;
      if (filterMonth !== '') {
        querySnapshot = await getDocs(query(collection(db, 'entries'), where('month', '==', filterMonth), orderBy('timestamp', 'desc')));
      } else {
        querySnapshot = await getDocs(query(collection(db, 'entries'), orderBy('timestamp', 'desc')));
      }
  
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTableData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // Call handleFilterByMonth whenever filterMonth changes
  useEffect(() => {
    handleFilterByMonth();
  }, [filterMonth]);

  return (
    <div>
      <div className='align-items-center' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          style={{
            width: '165px',
            height: '40px',
            backgroundColor: '#83EC44',
            color: '#EEEDE6',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            transition: 'background-color 0.3s, color 0.3s',
          }}
          className='font2'
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#DAD6CA';
            e.target.style.color = '#1E1E1E';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#83EC44';
            e.target.style.color = '#EEEDE6';
          }}
          onClick={() => setShowModal(true)}
        >
          Add Entry
        </button>

        <Link className='font2 btn text-end fs-5' style={{ marginLeft: 'auto', color: '#83EC44' }} to={'/summary'}>Go to Summary Page</Link>
      </div>



      {/* Input Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: '#F8F7F4' }}>
          <Modal.Title>{'Add Entry'}</Modal.Title>
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

          <label className='font2'>Scenario</label>
          <input type="number" className="form-control" value={scenario} onChange={e => setScenario(e.target.value)} />

          <label className='font2'>Notes</label>
          <textarea className="form-control" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: '#F8F7F4' }}>
          <Button variant="secondary" onClick={handleCancelSubmit}>
            Close
          </Button>
          <Button style={{ backgroundColor: '#4CBE08' }} onClick={handleInputSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirm} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this entry?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notes Modal */}
      <Modal show={selectedNote !== ''} onHide={handleCloseNoteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{selectedNote}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNoteModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className='col-2 mb-2'>
        <label className='font2'>Filter by Month:</label>
        <select className="form-select" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
          <option value="">All Months</option>
          {months.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
      </div>
      
      {/* Table */}
      <Table striped bordered>
        <thead>
          <tr className="align-middle text-center">
            <th className="custom-table-header">Name</th>
            <th className="custom-table-header">Month</th>
            <th className="custom-table-header">Week</th>
            <th className="custom-table-header">Steps</th>
            <th className="custom-table-header">Scenario</th>
            <th className="custom-table-header">Notes</th>
            <th className="custom-table-header">Action</th>
          </tr>
        </thead>
        <tbody>
  {getCurrentItems()
    .filter(entry => filterMonth === '' || entry.month === filterMonth) // Apply filter by month
    .map((entry, index) => (
    <tr key={entry.id} className='align-middle text-center' style={{ height: '50px' }}>
      <td>{entry.name}</td>
      <td>{entry.month}</td>
      <td>{entry.week}</td>
      <td>{entry.steps}</td>
      <td>{entry.scenario}</td>
      <td>
        <button className="btn btn-link" onClick={() => handleNoteClick(entry.notes)}>
          <FaRegNoteSticky style={{ color: '#1E1E1E' }} />
        </button>
      </td>
      <td>
        {!confirmedRows[entry.id] && (
          <>
            <button className="edit-button" onClick={() => handleEdit(entry.id)}>
              <FaEdit className='svg-container' style={{ color: '#EEEDE6' }} />
              <span>Edit</span>
            </button>

            <button className="delete-button" onClick={() => handleDelete(entry.id)}>
              <FaDeleteLeft className='svg-container' style={{ color: '#EEEDE6' }} />
              <span>Remove</span>
            </button>

            <button className="confirm-button" onClick={() => handleConfirmEntry(entry.id)}>
              <FaCheckSquare className='svg-container' style={{ color: '#EEEDE6' }} />
              <span>Confirm</span>
            </button>
          </>
        )}
        {confirmedRows[entry.id] && (
          <FaCheck style={{ color: '#4CBE08' }} />
        )}
      </td>
    </tr>
  ))}
</tbody>

      </Table>

      {/* Pagination */}
      <div style={{ textAlign: 'center' }}>
        <Pagination className='custom-pagination'>
          {currentPage > 1 && (
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
          )}
          {Array.from({ length: Math.ceil(tableData.length / itemsPerPage) }, (_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          {currentPage < Math.ceil(tableData.length / itemsPerPage) && (
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
          )}
        </Pagination>
      </div>

    </div>
  );
};

export default InputContent;