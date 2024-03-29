import React, { useState, useEffect } from 'react';
import BatchesOfStudents from './BatchesOfStudents';
import { Tab, Tabs } from 'react-bootstrap';
import ReviewsByStudents from './ReviewsByStudents';

const PlacementOfficerDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('batchesOfStudents');


  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };


  return (
    <div className='m-5'>
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
      </Tabs>

    </div>
  );
};

export default PlacementOfficerDashboard;
