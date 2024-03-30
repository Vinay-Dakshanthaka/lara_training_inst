import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';

const BatchesOfStudents = () => {
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

  return (
    <div className='table-responsive'>
      <h1>{collegeDetails.college_name}</h1>
      <h2>Students</h2>
      <table className="table">
        <thead>
          <tr>
            <th>SI NO</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Batch / Trainers </th>
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
                <BatchesList studentId={student.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BatchesList = ({ studentId }) => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
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
  
        const response = await axios.post(`${baseURL}/api/student/fetchTrainerAndBatchFromStudentId`, { studentId }, config);
        setBatches(response.data.batchesDetails || []);
      } catch (error) {
        console.error('Error fetching batches for student:', error);
      }
    };

    fetchBatches();
  }, [studentId]);

  return (
    <tbody>
      {batches.map((batch, index) => (
        <tr key={index}>
          <td>{batch.batch ? batch.batch.batch_name : 'N/A'}</td>
          <td>
            {batch.trainerDetails && batch.trainerDetails.length > 0 ? (
              <ul>
                {batch.trainerDetails.map((trainer, i) => (
                  <li key={i}>{trainer.name}</li>
                ))}
              </ul>
            ) : 'N/A'}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default BatchesOfStudents;
