import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import db from './firebaseconfig';
import { Table, Modal, Button } from 'react-bootstrap';

const SummaryPage = () => {
  const [summaryData, setSummaryData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCellData, setSelectedCellData] = useState(null); // To store the data of the clicked cell
  const [selectedCellNotes, setSelectedCellNotes] = useState(null); // To store the notes of the clicked cell
  const [monthlyTarget, setMonthlyTarget] = useState({}); // To store the monthly target for each person
  const [stepsDebt, setStepsDebt] = useState({}); // To store the steps debt for each person
  const [averagePercent, setAveragePercent] = useState({}); // To store the average percentage for each person
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    generateSummary();
  }, []);

  const generateSummary = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'entries'));
      const entries = querySnapshot.docs.map(doc => doc.data());

      // Initialize summary data
      const summaryData = {};

      // Group entries by month and then by name
      entries.forEach(entry => {
        if (entry.confirmed) {
          const { name, month, week, steps, notes } = entry;
          if (!summaryData[month]) {
            summaryData[month] = {};
          }
          if (!summaryData[month][name]) {
            summaryData[month][name] = { totalSteps: 0, weeks: {}, notes };
          }
          if (!summaryData[month][name].weeks[week]) {
            summaryData[month][name].weeks[week] = { steps: 0, notes };
          }
          summaryData[month][name].weeks[week].steps += steps;
          summaryData[month][name].totalSteps += steps;
        }
      });

      // Update state with summary data
      setSummaryData(summaryData);

      // Calculate monthly target, steps debt, and average percent for each person
      const target = {};
      const debt = {};
      const percent = {};
      for (const month in summaryData) {
        for (const name in summaryData[month]) {
          const steps = summaryData[month][name].totalSteps;
          const weeks = Object.keys(summaryData[month][name].weeks).length;
          const role = getRole(name); // Get role using the getRole function
          target[name] = role === 'auto' ? 1800 * weeks : 1500 * weeks;
          debt[name] = target[name] - steps;
          percent[name] = (steps / target[name]) * 100;
        }
      }
      setMonthlyTarget(target);
      setStepsDebt(debt);
      setAveragePercent(percent);
      console.log('Summary generated successfully.');
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleCellClick = (name, week, notes) => {
    const { steps, notes: cellNotes } = summaryData[selectedMonth][name].weeks[`Week ${week}`];
    setSelectedCellData(steps);
    setSelectedCellNotes(cellNotes);
  };

  const handleCloseModal = () => {
    setSelectedCellData(null);
    setSelectedCellNotes(null);
  };

  const getRole = (name) => {
    switch (name) {
      case 'Alin':
      case 'Cindy':
      case 'Dimas':
      case 'Fajar':
      case 'Khusnul':
        return 'auto';
      case 'Alzre':
      case 'Gita':
      case 'Izza':
      case 'Rania':
      case 'Yuda':
        return 'manual';
      default:
        return '';
    }
  };

  return (
    <div>
      <select 
        value={selectedMonth} 
        onChange={handleMonthChange} 
        className='font2' 
        style={{
          width: '165px',
          height: '40px',
          backgroundColor: '#83EC44',
          color: '#EEEDE6',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
          transition: 'background-color 0.3s, color 0.3s',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <option value="">Select Month</option>
        {months.map((month, index) => (
          <option key={index} value={month}>{month}</option>
        ))}
      </select>
      {selectedMonth && (
        <div>
          <h2 className='font2'>{selectedMonth}</h2>
          <Table bordered>
            <thead>
              <tr className="align-middle text-center" style={{ height: '50px' }}>
                <th className='custom-table-header' style={{ width: '10%' }}>Name</th>
                {Array.from({ length: 5 }, (_, i) => i + 1).map(week => (
                  <th key={week} className='custom-table-header' style={{ width: '10%' }}>Week {week}</th>
                ))}
                <th className='custom-table-header' style={{ width: '10%' }}>Total Steps</th>
                <th className='custom-table-header' style={{ width: '10%' }}>Monthly Target</th>
                <th className='custom-table-header' style={{ width: '10%' }}>Steps Debt</th>
                <th className='custom-table-header' style={{ width: '10%' }}>Average (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summaryData[selectedMonth] || {}).sort(([, a], [, b]) => b.totalSteps - a.totalSteps).map(([name, data], index) => (
                <tr key={index} className='align-middle text-center'> 
                  <td style={{backgroundColor: '#DAD6CA'}}>{name}</td>
                  {Array.from({ length: 5 }, (_, i) => i + 1).map(week => {
                    const steps = data.weeks[`Week ${week}`] ? data.weeks[`Week ${week}`].steps : 0;
                    const role = getRole(name);
                    const target = role === 'auto' ? 1800 : 1500;
                    const backgroundColor = steps < target ? '#CF3D3D' : '#83EC44';
                    return <td key={week} onClick={() => handleCellClick(name, week)} style={{ backgroundColor }}>{steps}</td>;
                  })}
                  <td style={{backgroundColor: '#DAD6CA'}}>{data.totalSteps || 0}</td>
                  <td style={{backgroundColor: '#DAD6CA'}}>{monthlyTarget[name] || 0}</td>
                  <td style={{backgroundColor: '#DAD6CA'}}>{stepsDebt[name] || 0}</td>
                  <td style={{backgroundColor: '#DAD6CA'}}>{averagePercent[name] ? averagePercent[name].toFixed(2) + '%' : '0%'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal for displaying cell data */}
      <Modal show={selectedCellData !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{selectedCellNotes}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SummaryPage;
