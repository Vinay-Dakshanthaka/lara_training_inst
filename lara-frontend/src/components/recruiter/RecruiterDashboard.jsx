import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CumulativeTest from '../cumulativeTest/CumulativeTest';
import CreateTestLink from '../placementTest/CreateTestLink';
import AllPlacementTests from '../placementTest/AllPlacementTests';

const RecruiterDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('studentDetails');
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  if (!isLoggedIn || userRole !== 'RECRUITER') {
    // If user is not authenticated or does not have admin role, redirect to home page
    return <Navigate to="/" replace />;
  }

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container">
      <h1 className='text-center'>Recruiter Dashboard</h1>
      <Tabs
        defaultActiveKey="addQuestionsToTestLInk"
        id="dashboard-tabs"
        onSelect={(key) => handleOptionChange(key)}
        className="mb-3"
      >
        <Tab eventKey="cumulativeTest" title="Cumulative Test">
          <CumulativeTest />
        </Tab>
        <Tab eventKey="create-test-link" title="Create Test Link">
          <CreateTestLink />
        </Tab>
        <Tab eventKey="addQuestionsToTestLInk" title="Add Questions To Test Link">
          <AllPlacementTests />
        </Tab>
      </Tabs>
    </div>
  );
};

export default RecruiterDashboard;
