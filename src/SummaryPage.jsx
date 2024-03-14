/* eslint-disable no-unused-vars */
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
  const [getScenario, setScenario] = useState(null);

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
          const { name, month, week, steps, notes, scenario } = entry;
          if (!summaryData[month]) {
            summaryData[month] = {};
          }
          if (!summaryData[month][name]) {
            summaryData[month][name] = { totalSteps: 0, weeks: {} };
          }
          if (!summaryData[month][name].weeks[week]) {
            summaryData[month][name].weeks[week] = { steps: 0, notes, scenario};
          }
          summaryData[month][name].weeks[week].steps += parseFloat(steps);
          summaryData[month][name].totalSteps += parseFloat(steps);
        }
      });

      // Update state with summary data
      setSummaryData(summaryData);

      const getWeeksInMonth = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate() - firstDay.getDate() + 1;
        return Math.ceil(daysInMonth / 7);
      }

      const getMonthNumber = (monthName) => {
        const months = {
          January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
          July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
        };
        return months[monthName];
      }

      // Calculate monthly target, steps debt, and average percent for each person
      const target = {};
      const debt = {};
      const percent = {};
      const scenarioz = {};
      for (const month in summaryData) {
        for (const name in summaryData[month]) {
          const monthNumber = getMonthNumber(month);
          const weeksInCurrentMonth = getWeeksInMonth(2024, monthNumber);
          const steps = summaryData[month][name].totalSteps;
          const weeks = Object.keys(summaryData[month][name].weeks).length;
          const role = getRole(name); // Get role using the getRole function
          //////////////////////////////////////////////////////////////////////////////
          target[name] = role === 'auto' ? 1800 * weeksInCurrentMonth : 1500 * weeksInCurrentMonth;
          debt[name] = parseFloat(target[name] - steps);
          percent[name] = (steps / target[name]) * 100;
        }
      }
      setMonthlyTarget(target);
      // setStepsDebt(debt);
      setAveragePercent(percent);
      console.log('Summary generated successfully.');

      // Add summary data to Firestore
      for (const month in summaryData) {
        const summaryDocRef = doc(db, 'summary', month);
        await setDoc(summaryDocRef, {
          month,
          data: summaryData[month],
          monthlyTarget: target,
          // stepsDebt: debt,
          averagePercent: percent
        });
        console.log(`Summary for ${month} added to Firestore.`);
      }
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
      case 'Daniel':
      case 'Dimas':
      case 'Jerry':
      case 'Fajar':
      case 'Khusnul':
        return 'auto';
      case 'Alzre':
      case 'Izza':
      case 'Rania':
      case 'Yuda':
      case 'Gita':
        return 'manual';
      default:
        return '';
    }
  };

  const sortedData = Object.entries(summaryData[selectedMonth] || {}).sort((a, b) => {
    const roleA = getRole(a[0]);
    const roleB = getRole(b[0]);
    if (roleA === roleB) {
      return a[0].localeCompare(b[0]);
    }
    if (roleA === 'manual') return 1;
    if (roleB === 'manual') return -1;
    return 0;
  });

  const kakGita = sortedData.find(([name]) => name === 'Gita');
  const otherData = sortedData.filter(([name]) => name !== 'Gita');

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
                <th rowSpan="2" className='custom-table-header' style={{ width: '10%' }}>Name</th>
                {Array.from({ length: 5 }, (_, i) => i + 1).map(week => (
                  <React.Fragment key={week}>
                    <th colSpan="2" className='custom-table-header' style={{ width: '12%' }}>Week {week}</th>
                  </React.Fragment>
                ))}
                <th rowSpan="2" className='custom-table-header' style={{ width: '10%' }}>Total Steps</th>
                <th rowSpan="2" className='custom-table-header' style={{ width: '10%' }}>Monthly Target</th>
                {/* <th rowSpan="2" className='custom-table-header' style={{ width: '10%' }}>Steps Debt</th> */}
                <th rowSpan="2" className='custom-table-header' style={{ width: '10%' }}>Achievement (%)</th>
              </tr>
              <tr className="align-middle text-center" style={{ height: '50px' }}>
                {Array.from({ length: 5 }, (_, i) => i + 1).map(week => (
                  <React.Fragment key={week}>
                    <th className='custom-table-header' style={{ width: '6%' }}>Steps</th>
                    <th className='custom-table-header' style={{ width: '6%' }}>Scenario</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
                {/* Render other data except 'Kak Gita' */}
                {otherData.map(([name, data]) => (
                  <tr key={name} className='align-middle text-center'>
                    <td rowSpan="1" style={{ backgroundColor: '#DAD6CA' }}>{name}</td>
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(week => {
                      const steps = data.weeks[`Week ${week}`] ? data.weeks[`Week ${week}`].steps : 0;
                      const role = getRole(name);
                      const target = role === 'auto' ? 1800 : 1500;
                      const backgroundColor = steps < target ? '#CF3D3D' : '#83EC44';
                      return (
                        <React.Fragment key={week}>
                          <td style={{ backgroundColor, cursor: 'pointer'}} onClick={() => handleCellClick(name, week)}>{steps}</td>
                          <td style={{ backgroundColor: '#DAD6CA' }}>
                            {data.weeks[`Week ${week}`] ? data.weeks[`Week ${week}`].scenario : ''}
                          </td>
                        </React.Fragment>
                      );
                    })}
                    {/* Display total steps, monthly target, and average percentage */}
                    <td style={{ backgroundColor: '#DAD6CA' }}>{data.totalSteps || 0}</td>
                    <td style={{ backgroundColor: '#DAD6CA' }}>{monthlyTarget[name] || 0}</td>
                    <td style={{ backgroundColor: '#DAD6CA' }}>{averagePercent[name] ? averagePercent[name].toFixed(2) + '%' : '0%'}</td>
                  </tr>
                ))}

                {/* Render 'Kak Gita' separately at the bottom */}
                {kakGita && (
                  <tr key={kakGita[0]} className='align-middle text-center'>
                  <td rowSpan="1" style={{ backgroundColor: '#DAD6CA' }}>{kakGita[0]}</td>
                  {Array.from({ length: 5 }, (_, i) => i + 1).map(week => {
                    const steps = kakGita[1].weeks[`Week ${week}`] ? kakGita[1].weeks[`Week ${week}`].steps : 0;
                    // const backgroundColor = steps < 1500 ? '#CF3D3D' : '#83EC44'; // Assuming manual role for 'Gita'
                    return (
                      <React.Fragment key={week}>
                        <td style={{backgroundColor: '#DAD6CA', cursor: 'pointer'}} onClick={() => handleCellClick(kakGita[0], week)}>{steps}</td>
                        <td style={{ backgroundColor: '#DAD6CA' }}>
                          {kakGita[1].weeks[`Week ${week}`] ? kakGita[1].weeks[`Week ${week}`].scenario : ''}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td style={{ backgroundColor: '#DAD6CA' }}>{kakGita[1].totalSteps || 0}</td>
                  <td style={{ backgroundColor: '#DAD6CA' }}>{monthlyTarget[kakGita[0]] || 0}</td>
                  <td style={{ backgroundColor: '#DAD6CA' }}>{averagePercent[kakGita[0]] ? averagePercent[kakGita[0]].toFixed(2) + '%' : '0%'}</td>
                </tr>
                )}
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
          <pre style={{ whiteSpace: 'pre-wrap' }}>{selectedCellNotes}</pre>
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
