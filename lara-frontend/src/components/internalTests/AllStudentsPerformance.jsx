// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Table, Spinner, Badge } from 'react-bootstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { baseURL } from '../config';

// const AllStudentsPerformance = () => {
//     const [performanceData, setPerformanceData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchStudentPerformance();
//     }, []);

//     const fetchStudentPerformance = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 throw new Error("No token provided.");
//             }

//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             };  

//             const response = await axios.get(`${baseURL}/api/internal-test/getAllStudentsPerformance`, config);
//             setPerformanceData(response.data.performance.student_performance);
//         } catch (error) {
//             console.error('Error fetching student performance data:', error);
//             toast.error('Error fetching student performance data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <div className="text-center"><Spinner animation="border" /></div>;
//     }

//     if (performanceData.length === 0) {
//         return <div>No student performance data found.</div>;
//     }

//     return (
//         <Container className="mt-5">
//             <h2 className='text-center'>Student Performance Overview</h2>

//             {/* Toast Notification */}
//             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

//             {/* Performance Summary Table */}
//             <Table striped bordered hover responsive>
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Total Tests Attended</th>
//                         <th>Total Marks Obtained</th>
//                         <th>Total Possible Marks</th>
//                         <th>Average Score per Test</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {performanceData.map(student => (
//                         <tr key={student.student_id}>
//                             <td>{student.student_name}</td>
//                             <td>{student.email}</td>
//                             <td>{student.total_tests_attended}</td>
//                             <td>{student.total_marks_obtained}</td>
//                             <td>{student.total_possible_marks}</td>
//                             <td>
//                                 <Badge pill bg={parseFloat(student.average_score_per_test) >= 75 ? "success" : parseFloat(student.average_score_per_test) >= 50 ? "warning" : "danger"}>
//                                     {student.average_score_per_test}
//                                 </Badge>
//                             </td>
                           
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </Container>
//     );
// };

// export default AllStudentsPerformance;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Spinner, Badge, Button, Pagination, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // Import Link for navigation
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';

const AllStudentsPerformance = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        fetchStudentPerformance();
    }, []);

    const fetchStudentPerformance = async () => {
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

            const response = await axios.get(`${baseURL}/api/internal-test/getAllStudentsPerformance`, config);
            setPerformanceData(response.data.performance.student_performance);
        } catch (error) {
            console.error('Error fetching student performance data:', error);
            toast.error('Error fetching student performance data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center"><Spinner animation="border" /></div>;
    }

    if (performanceData.length === 0) {
        return <div>No student performance data found.</div>;
    }

    // Filter performance data based on search query
    const filteredData = performanceData.filter(student => {
        const { student_name, email, phone_number } = student; 
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            student_name.toLowerCase().includes(lowerCaseQuery) ||
            email.toLowerCase().includes(lowerCaseQuery) ||
            (phone_number && phone_number.includes(lowerCaseQuery)) // Check if phone number is defined
        );
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Container className="mt-5">
            <h2 className='text-center'>Student Performance Overview</h2>

            {/* Toast Notification */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

            {/* Search Input */}
            <Form.Group controlId="search" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search by name, or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Form.Group>

            {/* Performance Summary Table */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Total Tests Attended</th>
                        <th>Total Marks Obtained</th>
                        <th>Total Possible Marks</th>
                        <th>Average Score per Test</th>
                        <th>Overview</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map(student => (
                        <tr key={student.student_id}>
                            <td>{student.student_name}</td>
                            <td>{student.email}</td>
                            <td>{student.total_tests_attended}</td>
                            <td>{student.total_marks_obtained}</td>
                            <td>{student.total_possible_marks}</td>
                            <td>
                                <Badge pill bg={parseFloat(student.average_score_per_test) >= 75 ? "success" : parseFloat(student.average_score_per_test) >= 50 ? "warning" : "danger"}>
                                    {student.average_score_per_test}
                                </Badge>
                            </td>
                            <td>
                                <Link to={`/student-performance/${student.student_id}`}>
                                    <Button variant="primary">Overview</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination Controls */}
            <Pagination className="justify-content-center">
                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            </Pagination>
        </Container>
    );
};

export default AllStudentsPerformance;
