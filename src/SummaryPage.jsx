import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import db from './firebaseconfig';
import { Table, Modal, Button } from 'react-bootstrap';

const SummaryPage = () => {
  const [summaryData, setSummaryData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCellData, setSelectedCellData] = useState(null);
  const [selectedCellNotes, setSelectedCellNotes] = useState(null);
  const [monthlyTarget, setMonthlyTarget] = useState({});
  const [averagePercent, setAveragePercent] = useState({});
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const totalWeeks = {
    January: 5,
    February: 4,
    March: 5,
    April: 4,
    May: 5,
    June: 5,
    July: 5,
    August: 5,
    September: 5,
    October: 5,
    November: 5,
    December: 5
  };

  useEffect(() => {
    generateSummary();
  }, []);

  const generateSummary = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'entries'));
      const entries = querySnapshot.docs.map(doc => doc.data());

      const newSummaryData = {};

      entries.forEach(entry => {
        if (entry.confirmed) {
          const { name, month, week, steps, notes, scenario } = entry;
          newSummaryData[month] = newSummaryData[month] || {};
          newSummaryData[month][name] = newSummaryData[month][name] || { totalSteps: 0, weeks: {} };
          newSummaryData[month][name].weeks[week] = newSummaryData[month][name].weeks[week] || { steps: 0, notes, scenario };
          newSummaryData[month][name].weeks[week].steps += parseFloat(steps);
          newSummaryData[month][name].totalSteps += parseFloat(steps);
        }
      });

      setSummaryData(newSummaryData);

      const newMonthlyTarget = {};
      const newAveragePercent = {};

      for (const month in newSummaryData) {
        const totalWeek = totalWeeks[month];
        for (const name in newSummaryData[month]) {
          const role = getRole(name);
          newMonthlyTarget[`${month}-${name}`] = role === 'auto' ? 1800 * totalWeek : 1500 * totalWeek;
          newAveragePercent[`${month}-${name}`] = calculateAveragePercent(newSummaryData[month][name].totalSteps, newMonthlyTarget[`${month}-${name}`]);
        }
      }

      setMonthlyTarget(newMonthlyTarget);
      setAveragePercent(newAveragePercent);

      // Update Firestore
      await updateFirestore(newSummaryData, newMonthlyTarget, newAveragePercent);

      console.log('Summary generated successfully.');
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const updateFirestore = async (summaryData, monthlyTarget, averagePercent) => {
    try {
      for (const month in summaryData) {
        const summaryDocRef = doc(db, 'summary', month);
        await setDoc(summaryDocRef, {
          month,
          data: summaryData[month],
          monthlyTarget,
          averagePercent
        });
        console.log(`Summary for ${month} added to Firestore.`);
      }
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
  };

  const calculateAveragePercent = (totalSteps, monthlyTarget) => {
    return totalSteps && monthlyTarget ? (totalSteps / monthlyTarget) * 100 : 0;
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleCellClick = (name, week) => {
    const weekData = summaryData[selectedMonth]?.[name]?.weeks[`Week ${week}`];
    if (weekData) {
      setSelectedCellData(weekData.steps);
      setSelectedCellNotes(weekData.notes);
    } else {
      setSelectedCellData(null);
      setSelectedCellNotes(null);
    }
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
      case 'Fajar':
      case 'Khusnul':
      case 'Jerry':
        return 'auto';
      case 'Alzre':
      case 'Gita':
      case 'Izza':
      case 'Rania':
      case 'Yuda':
      case 'Aldo':
        return 'manual';
      default:
        return '';
    }
  };

  const renderTableHeader = () => {
    return (
      <thead>
        <tr className="align-middle text-center" style={{ height: '50px' }}>
          <th rowSpan="2" className='custom-table-header' style={{ width: '10%' }}>Name</th>
          {Array.from({ length: totalWeeks[selectedMonth] || 5 }, (_, i) => i + 1).map(week => (
            <React.Fragment key={week}>
              <th colSpan="2" className='custom-table-header' style={{ width: '10%' }}>Week {week}</th>
            </React.Fragment>
          ))}
          <th rowSpan="2" className='custom-table-header' style={{ width: '10%' }}>Total Steps</th>
          <th rowSpan="2" className='custom-table-header' style={{ width: '10%' }}>Monthly Target</th>
          <th rowSpan="2" className='custom-table-header' style={{ width: '10%' }}>Achievement (%)</th>
        </tr>
        <tr className="align-middle text-center" style={{ height: '50px' }}>
          {Array.from({ length: totalWeeks[selectedMonth] || 5 }, (_, i) => i + 1).map(week => (
            <React.Fragment key={week}>
              <th className='custom-table-header' style={{ width: '5%' }}>Steps</th>
              <th className='custom-table-header' style={{ width: '5%' }}>Scenario</th>
            </React.Fragment>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody>
        {sortedData.map(([name, data]) => (
          <tr key={name} className='align-middle text-center'>
            <td rowSpan="1" style={{ backgroundColor: '#DAD6CA' }}>{name}</td>
            {Array.from({ length: totalWeeks[selectedMonth] || 5 }, (_, i) => i + 1).map(week => {
              const weekData = data.weeks[`Week ${week}`];
              const steps = weekData ? weekData.steps : 0;
              const scenario = weekData ? weekData.scenario : '-';
              const role = getRole(name);
              const target = role === 'auto' ? 1800 : 1500;
              const backgroundColor = steps < target ? '#CF3D3D' : '#83EC44';
              // const backgroundColor = averagePercent < 100 ? '#CF3D3D' : '#83EC44';
              return (
                <React.Fragment key={week}>
                  <td style={{ backgroundColor, cursor: 'pointer' }} onClick={() => handleCellClick(name, week)}>{steps}</td>
                  <td style={{ backgroundColor: '#DAD6CA' }}>{scenario}</td>
                </React.Fragment>
              );
            })}
            <td style={{ backgroundColor: '#DAD6CA' }}>{data.totalSteps || 0}</td>
            <td style={{ backgroundColor: '#DAD6CA' }}>{monthlyTarget[`${selectedMonth}-${name}`] || 0}</td>
            <td style={{ backgroundColor: averagePercent[`${selectedMonth}-${name}`] && averagePercent[`${selectedMonth}-${name}`] >= 100 ? '#83EC44' : '#CF3D3D' }}>{averagePercent[`${selectedMonth}-${name}`] ? averagePercent[`${selectedMonth}-${name}`].toFixed(2) + '%' : '0%'}</td>
          </tr>
        ))}
        {kakGita && (
          <tr key={kakGita[0]} className='align-middle text-center'>
            <td rowSpan="1" style={{ backgroundColor: '#DAD6CA' }}>{kakGita[0]}</td>
            {Array.from({ length: totalWeeks[selectedMonth] || 5 }, (_, i) => i + 1).map(week => {
              const weekData = kakGita[1].weeks[`Week ${week}`];
              const steps = weekData ? weekData.steps : 0;
              const scenario = weekData ? weekData.scenario : '-';
              const backgroundColor = steps < 1500 ? '#CF3D3D' : '#83EC44';
              return (
                <React.Fragment key={week}>
                  <td style={{ backgroundColor, cursor: 'pointer' }}>{steps}</td>
                  <td style={{ backgroundColor: '#DAD6CA' }}>{scenario}</td>
                </React.Fragment>
              );
            })}
            <td style={{ backgroundColor: '#DAD6CA' }}>{kakGita[1].totalSteps || 0}</td>
            <td style={{ backgroundColor: '#DAD6CA' }}>{monthlyTarget[`${selectedMonth}-${kakGita[0]}`] || 0}</td>
            <td style={{ backgroundColor: averagePercent[`${selectedMonth}-${kakGita[0]}`] && averagePercent[`${selectedMonth}-${kakGita[0]}`] >= 100 ? '#83EC44' : '#CF3D3D' }}>{averagePercent[`${selectedMonth}-${kakGita[0]}`] ? averagePercent[`${selectedMonth}-${kakGita[0]}`].toFixed(2) + '%' : '0%'}</td>
          </tr>
        )}
      </tbody>
    );
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
            {renderTableHeader()}
            {renderTableBody()}
          </Table>
        </div>
      )}

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
