import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Badge, Container, Pagination, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import { Link } from 'react-router-dom';
// import './StudentInternalTestDetails.css'; 

const ITEMS_PER_PAGE = 5; // Adjust the number of items per page

const StudentInternalTestDetails = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTestDetails();
    }, []);

    const fetchTestDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${baseURL}/api/internal-test/getStudentInternalTestDetails`, config);
            setTests(response.data.internalTests);
        } catch (error) {
            console.error('Error fetching test details:', error);
            toast.error('Error fetching test details');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedTests = tests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(tests.length / ITEMS_PER_PAGE);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center">Your Test Details</h2>
            <Table striped bordered hover responsive className="mt-4">
                <thead>
                    <tr>
                        <th>Test Link</th>
                        <th>Number of Questions</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Detailed Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTests.map((test) => (
                        <tr key={test.internal_test_id}>
                            <td>
                                <a href={test.internal_test_link} target="_blank" rel="noopener noreferrer">
                                    {test.internal_test_link}
                                </a>
                            </td>
                            <td>{test.number_of_questions}</td>
                            <td>{test.test_description}</td>
                            <td>
                                {test.attended ? (
                                    <span className="text-success">Attended</span>
                                ) : (
                                    <Badge bg="danger">Not Attended</Badge>
                                )}
                            </td>
                            <td>
                                {test.attended && (
                                    <Link to={`/detailed-internal-result/${test.internal_test_id}`}>
                                        <Button variant="info">View </Button>
                                    </Link>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center mt-4">
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover /> */}
        </Container>
    );
};

export default StudentInternalTestDetails;
