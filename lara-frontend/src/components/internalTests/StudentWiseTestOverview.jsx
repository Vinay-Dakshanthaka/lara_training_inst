import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';  // Assuming baseURL is exported from config.js

const StudentWiseTestOverview = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    const fetchStudentDetails = async () => {
        try {
            const token = localStorage.getItem('token');  // Assuming token is stored in localStorage
            if (!token) {
                throw new Error('No token provided');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${baseURL}/api/internal-test/getAllStudentDetailsForPerformance`, config);
            setStudents(response.data.students); // Assuming response contains a 'students' array
        } catch (error) {
            console.error('Error fetching student details:', error);
            toast.error('Error fetching student details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (!students.length) {
        return (
            <Container className="text-center mt-5">
                <p>No student details found.</p>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
            <h2 className="text-center mb-4">Student Details</h2>
            <Row>
                <Col>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student.id}> {/* Assuming each student has a unique 'id' */}
                                    <td>{index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phoneNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default StudentWiseTestOverview;
