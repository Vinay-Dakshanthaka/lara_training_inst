import React, { useState } from 'react';
import AllStudents from './AllStudents';
import AllStudentsProfiles from './AllStudentsProfiles';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '../admin/AdminDashboard';
import { Tab, Tabs } from 'react-bootstrap';
import BatchDetails from '../admin/BatchDetails';
import TrainerDetails from '../admin/TrainerDetails';
import StudentReviews from '../admin/StudentReviews';
import StudentDetails from '../admin/StudentDetails';
import {baseURL}  from '../config';

const StudentAdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('studentDetails');
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  if (!isLoggedIn || userRole !== 'SUPER ADMIN') {
    // If user is not authenticated or does not have super admin role, redirect to home page
    return <Navigate to="/" replace />;
  }

  // const handleOptionChange = (event) => {
  //   setSelectedOption(event.target.value);
  // };
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container">
    <h1 className='text-center m-4'>Dashboard</h1>
    {/* <div className="row">
      <div className="col-auto">
        <div className="form-check">
          <input
            type="radio"
            value="studentDetails"
            checked={selectedOption === 'studentDetails'}
            onChange={handleOptionChange}
            className="form-check-input"
          />
          <label className="form-check-label">Student Details</label>
        </div>
      </div>
      <div className="col-auto">
        <div className="form-check">
          <input
            type="radio"
            value="profileDetails"
            checked={selectedOption === 'profileDetails'}
            onChange={handleOptionChange}
            className="form-check-input"
          />
          <label className="form-check-label">Profile Details</label>
        </div>
      </div>
    </div> */}

    <Tabs
        defaultActiveKey="studentDetails"
        id="dashboard-tabs"
        onSelect={(key) => handleOptionChange(key)}
        className="mb-3"
      >
        <Tab eventKey="studentDetails" title="Assign Role">
          <AllStudents />
        </Tab>
        <Tab eventKey="Student Profiles" title="Profile Details">
          <AllStudentsProfiles />
        </Tab>
        <Tab eventKey="batchDetails" title="Batch Details">
          <BatchDetails />
        </Tab>
        <Tab eventKey="trainers" title="Trainers">
          <TrainerDetails />
        </Tab>
        <Tab eventKey="studentReviews" title="Student Reviews">
          <StudentReviews />
        </Tab>
        {/* <Tab eventKey="allStudents" title="Student Reviews">
          <AllStudents />
        </Tab> */}
      </Tabs>

    {/* {selectedOption === 'studentDetails' ? <AllStudents /> : <AllStudentsProfiles />} */}
  </div>
  );
};

export default StudentAdminDashboard;
