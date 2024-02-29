import React, { useState } from 'react';
import AllStudents from './AllStudents';
import AllStudentsProfiles from './AllStudentsProfiles';
import { Navigate } from 'react-router-dom';

const StudentAdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('studentDetails');
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  if (!isLoggedIn || userRole !== 'SUPER ADMIN') {
    // If user is not authenticated or does not have super admin role, redirect to home page
    return <Navigate to="/" replace />;
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="container">
    <h1 className='text-center'>Super Admin Dashboard</h1>
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
    </div>

    {selectedOption === 'studentDetails' ? <AllStudents /> : <AllStudentsProfiles />}
  </div>
  );
};

export default StudentAdminDashboard;
