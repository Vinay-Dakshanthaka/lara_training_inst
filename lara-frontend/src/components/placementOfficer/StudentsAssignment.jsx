import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { useNavigate } from 'react-router-dom';

const StudentsAssignment = () => {
    const [collegeDetails, setCollegeDetails] = useState({});
    const [students, setStudents] = useState([]);
    const navigate = useNavigate(); 

    const handleSubmissions = (studentId) => {
        navigate(`/answers/${studentId}`); 
    };

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
                        <th>Answers Submissions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>
                                {/* redirect to answers page */}
                                <button onClick={() => handleSubmissions(student.id)} className="btn btn-primary">Submissions</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default StudentsAssignment