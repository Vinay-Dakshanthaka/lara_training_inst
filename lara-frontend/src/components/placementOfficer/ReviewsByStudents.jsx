import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import StudentReviewsByStudentId from './StudentReviewsByStudentId';
import BatchesOfStudents from './BatchesOfStudents';
import { Tab, Tabs } from 'react-bootstrap';

const ReviewsByStudents = () => {
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
        setCollegeDetails(response.data[0]); 
        const collegeId = response.data[0].id; 
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

    // State variable to manage the visibility of reviews for each student
    const [showReviews, setShowReviews] = useState({});

    // Function to toggle the visibility of reviews for a specific student
    const toggleReviews = (studentId) => {
      setShowReviews((prev) => ({
        ...prev,
        [studentId]: !prev[studentId] // Toggle visibility for the specific student
      }));
    };

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
              <td>
                <button onClick={() => toggleReviews(student.id)} className='btn btn-info'>Student opinion  on Trainers</button>
                {showReviews[student.id] && <StudentReviewsByStudentId studentId={student.id} />}
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsByStudents;
