import React, { useState } from 'react';
import AllStudentsProfiles from '../superAdmin/AllStudentsProfiles';
import StudentDetails from './StudentDetails';
import AssignRole from './AssignRole'; 
import { Navigate, useNavigate } from 'react-router-dom';
import TrainerDetails from './TrainerDetails';
import BatchDetails from './BatchDetails';

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('studentDetails');
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  if (!isLoggedIn || userRole !== 'ADMIN') {
    // If user is not authenticated or does not have admin role, redirect to home page
    return <Navigate to="/" replace />;
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="container">
      <h1 className='text-center'> Admin Dashboard</h1>
      <div className="row">
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
        <div className="col-auto">
          <div className="form-check">
            <input
              type="radio"
              value="assignRole"
              checked={selectedOption === 'assignRole'}
              onChange={handleOptionChange}
              className="form-check-input"
            />
            <label className="form-check-label">Assign Role</label>
          </div>
        </div>
        <div className="col-auto">
          <div className="form-check">
            <input
              type="radio"
              value="batchDetails"
              checked={selectedOption === 'batchDetails'}
              onChange={handleOptionChange}
              className="form-check-input"
            />
            <label className="form-check-label">Batch Details</label>
          </div>
        </div>
      </div>

      {/* Render the appropriate component based on the selected option */}
      {selectedOption === 'studentDetails' ? <StudentDetails /> : 
       selectedOption === 'profileDetails' ? <AllStudentsProfiles /> :
       selectedOption === 'batchDetails' ? <BatchDetails /> :
       selectedOption === 'assignRole' ? <AssignRole /> : null}
    </div>
  );
};

export default AdminDashboard;
