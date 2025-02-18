import React, { useState, useEffect } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import axios from 'axios'; // Make sure axios is imported
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Paginate from '../common/Paginate';

const PlacementOfficer = () => {
    const [students, setStudents] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Start at page 1
    const [itemsPerPage] = useState(5); // Number of items per page

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

            const studentResponse = await axios.get(`${baseURL}/api/student/getAllStudentDetails`, config);
            const collegeResponse = await axios.get(`${baseURL}/api/student/getAllCollegeDetails`, config);

            const collegesData = collegeResponse.data.reduce((acc, college) => {
                acc[college.placement_officer_id] = college.college_name;
                return acc;
            }, {});

            const filteredStudents = studentResponse.data.filter(student => student.role === "PLACEMENT OFFICER");
            const studentsWithColleges = filteredStudents.map(student => ({
                ...student,
                college_name: collegesData[student.id] || 'N/A' // Assign college name or 'N/A' if not found
            }));

            setStudents(studentsWithColleges.map(student => ({ ...student, selectedCollegeId: '' }))); // Add selectedCollegeId property to each student
        } catch (error) {
            console.error(error);
        }
    };

    const fetchColleges = async () => {
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

            const response = await axios.get(`${baseURL}/api/student/getAllCollegeDetails`, config);
            setColleges(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchColleges();
    }, []);

    const handleAssign = async (studentId, collegeId) => {
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

            const response = await axios.post(`${baseURL}/api/student/assignPlacementOfficerToCollege`, { college_id: collegeId, placement_officer_id: studentId }, config);

            // Check response status
            if (response.status === 200) {
                toast.success('Success ')
                console.log("Success: Placement officer assigned to college.");
                fetchStudents();
                fetchColleges();
            }
            else if (response.status === 409) {
                toast.warning("Already assigned to a college.")
                console.log("Error: Already assigned to a college.");
                fetchStudents();
                fetchColleges();
            } else {
                toast.error("Something went wrong")
                console.error('Error assigning student to college: Unexpected response status.', response.status);
            }
        } catch (error) {
            console.error('Error assigning student to college:', error);
            // Handle error
        }
    };

    const handleDeassign = async (collegeId) => {
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

            const response = await axios.post(`${baseURL}/api/student/deassignPlacementOfficerFromCollege`, { college_id: collegeId }, config);
            toast.success("De-assigned successfully")
            console.log(response.data.message); // Log success message
            // Optionally, you can update the state or perform any additional actions after successful de-assignment
        } catch (error) {
            console.error('Error de-assigning placement officer from college:', error);
            toast.error("Something Went wrong")
            // Handle error
        }
    };

    const handleCollegeChange = (e, studentId) => {
        const collegeId = e.target.value;
        setStudents(prevStudents => 
            prevStudents.map(student => 
                student.id === studentId ? { ...student, selectedCollegeId: collegeId } : student
            )
        );
    };
   // Pagination logic
   const indexOfLastStudent = currentPage * itemsPerPage;
   const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
   const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

   const handlePageChange = (pageNumber) => {
       setCurrentPage(pageNumber);
   };
    return (
        <Container className='table-responsive'>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Role</th>
                        <th>Assigned College</th>
                        <th>Colleges</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStudents.length > 0 ? (
                        currentStudents.map(student => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.phoneNumber}</td>
                                <td>{student.role}</td>
                                <td>{student.college_name}</td>
                                <td>
                                    <select value={student.selectedCollegeId} onChange={(e) => handleCollegeChange(e, student.id)}>
                                        <option value="">Select</option>
                                        {colleges.map(college => (
                                            <option key={college.id} value={college.id}>{college.college_name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <Button variant="success" onClick={() => handleAssign(student.id, student.selectedCollegeId)}>Assign</Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDeassign(student.selectedCollegeId)}>De-assign</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">N/A</td>
                        </tr>
                    )}
                </tbody>
            </Table>
       
      {/* Pagination component */}
      <Paginate
                currentPage={currentPage}
                totalItems={students.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </Container>
    );
}

export default PlacementOfficer;