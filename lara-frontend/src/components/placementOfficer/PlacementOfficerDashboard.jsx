import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import StudentReviewsByStudentId from './StudentReviewsByStudentId';

const PlacementOfficerDashboard = () => {
  const [collegeDetails, setCollegeDetails] = useState({});
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response = await axios.get(`${baseURL}/api/student/getAllCollegeDetailsForPlacemmentOfficer`, config);
        setCollegeDetails(response.data[0]); // Assuming collegeDetails is an array and we're taking the first item
        const collegeId = response.data[0].id; // Assuming college ID is under the key 'id'
        fetchStudentsByCollegeId(collegeId);
      } catch (error) {
        console.error('Error fetching college details:', error);
      }
    };
  
    const fetchStudentsByCollegeId = async (collegeId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response = await axios.post(`${baseURL}/api/student/getAllStudentsByCollegeId`, { collegeId }, config);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchCollegeDetails();
  }, []);

  return (
    <div>
      <h1>College Name: {collegeDetails.college_name}</h1>
      <h2>Students</h2>
      <table className="table">
        <thead>
          <tr>
            <th>SI NO</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Reviews</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
              <td><StudentReviewsByStudentId studentId={student.id} /></td>
              {/* <Link to={`/reviews/${student.id}`} className="btn btn-primary">View Reviews</Link> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlacementOfficerDashboard;
