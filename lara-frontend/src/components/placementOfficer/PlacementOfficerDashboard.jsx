import React, { useState, useEffect } from 'react';
import BatchesOfStudents from './BatchesOfStudents';
import { Tab, Tabs } from 'react-bootstrap';
import ReviewsByStudents from './ReviewsByStudents';
import StudentAttendance from './StudentAttendance';
import StudentsAssignment from './StudentsAssignment';

const PlacementOfficerDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('batchesOfStudents');


  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };


  return (
    <div className='m-2'>
      <h1 className='text-center display-4'>Dashboard</h1>
      <Tabs
        defaultActiveKey="batchesOfStudents"
        id="dashboard-tabs"
        onSelect={(key) => handleOptionChange(key)}
        className="mb-3"
      >
        <Tab eventKey="batchesOfStudents" title="Batch Details">
          <BatchesOfStudents />
        </Tab>
        <Tab eventKey="reviews" title="Reviews By Students">
          <ReviewsByStudents />
        </Tab>
        <Tab eventKey="studentAttendance" title="Attendance">
          <StudentAttendance />
        </Tab>
        <Tab eventKey="studentsAssignment" title="Assignment">
          <StudentsAssignment />
        </Tab>
      </Tabs>

    </div>
  );
};

export default PlacementOfficerDashboard;
