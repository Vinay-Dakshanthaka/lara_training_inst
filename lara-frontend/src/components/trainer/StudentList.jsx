import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {baseURL}  from '../config';

const StudentList = ({ batchId }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
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

        const response = await axios.post(
          `${baseURL}/api/student/getStudentsByBatchId`,
          { batchId },
          config
        );
        const studentsData = response.data.students;
        
        // Fetch additional details for each student
        const studentsWithDetails = await Promise.all(studentsData.map(async (student) => {
          const profileResponse = await axios.post(
            `${baseURL}/api/student/getProfileDetailsById`,
            { student_id: student.id },
            config
          );
          const profileData = profileResponse.data;
          return { ...student, profile: profileData }; // Merge student data with profile data
        }));
        
        setStudents(studentsWithDetails);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchStudents();
  }, [batchId]);

  return (
    <div>
      <h1>Students in Batch</h1>
      <table className="table m-5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Highest Education</th>
            <th>Year of Passout</th>
            <th>Specialization</th>
            <th>Actions</th> {/* Add a column for actions */}
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.profile.highest_education}</td>
              <td>{student.profile.year_of_passout}</td>
              <td>{student.profile.specialization}</td>
              <td>
                <Link to={`/assignment-answers/${batchId}/${student.id}`} className="btn btn-primary">
                  Assignment Answers
                </Link>
              </td> {/* Create a button to redirect to AssignmentAnswers */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
