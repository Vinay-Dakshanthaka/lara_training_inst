import React, { useState } from 'react';
import AllStudentsProfiles from '../superAdmin/AllStudentsProfiles';
import StudentDetails from './StudentDetails';
import { Navigate, useNavigate } from 'react-router-dom';

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
     
    </div>

    {selectedOption === 'studentDetails' ? <StudentDetails /> : <AllStudentsProfiles />}
  </div>
  );
};

export default AdminDashboard;
