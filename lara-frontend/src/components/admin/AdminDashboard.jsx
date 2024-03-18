import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import AllStudentsProfiles from '../superAdmin/AllStudentsProfiles';
import StudentDetails from './StudentDetails';
import AssignRole from './AssignRole'; 
import TrainerDetails from './TrainerDetails';
import BatchDetails from './BatchDetails';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {baseURL}  from '../config';
import StudentReviews from './StudentReviews';

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('studentDetails');
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  if (!isLoggedIn || userRole !== 'ADMIN') {
    // If user is not authenticated or does not have admin role, redirect to home page
    return <Navigate to="/" replace />;
  }

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container">
      <h1 className='text-center'>Admin Dashboard</h1>
      <Tabs
        defaultActiveKey="studentDetails"
        id="dashboard-tabs"
        onSelect={(key) => handleOptionChange(key)}
        className="mb-3"
      >
        <Tab eventKey="studentDetails" title="Student Details">
          <StudentDetails />
        </Tab>
        <Tab eventKey="profileDetails" title="Profile Details">
          <AllStudentsProfiles />
        </Tab>
        <Tab eventKey="assignRole" title="Assign Role">
          <AssignRole />
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
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
