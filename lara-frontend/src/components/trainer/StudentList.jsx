import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { baseURL } from '../config';
import { Tooltip } from '@mui/material';

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
          try {
            const profileResponse = await axios.post(
              `${baseURL}/api/student/getProfileDetailsById`,
              { student_id: student.id },
              config
            );
            const profileData = profileResponse.data;

            return { ...student, profile: profileData || null }; // Merge student data with profile data, set profile to null if not found
          } catch (error) {
            console.error(`Failed to fetch profile details for student ${student.id}:`, error);
            return { ...student, profile: null }; // Assign null if there's an error fetching profile details
          }
        }));

        setStudents(studentsWithDetails);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchStudents();
  }, [batchId]);

  return (
    <div className='table-responsive'>
      <h1>Students in Batch</h1>
      <table className="table">
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
              <td>{student.profile ? student.profile.highest_education : 'N/A'}</td>
              <td>{student.profile ? student.profile.year_of_passout : 'N/A'}</td>
              <td>{student.profile ? student.profile.specialization : 'N/A'}</td>
              <td>
                <Link
                  to={`/assignment-answers/${batchId}/${student.id}`}
                  className={`btn ${student.marksBoolean ? 'btn-primary' : 'btn-primary'}`}
                  style={{ position: "relative", display: "inline-block" }}
                >
                  Assignment Answers
                  {student.marksBoolean && (
                    <Tooltip title="Evaluation Pending">
                      <span
                      className="badge bg-danger"
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        transform: "translate(50%, -50%)",
                      }}
                    >
                      !
                    </span>
                    </Tooltip>
                  )}
                </Link>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
