import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Spinner, Badge, Card, Alert } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import { useParams } from 'react-router-dom'; // Import useParams

const StudentPerformanceDashboard = () => {
    const { studentId } = useParams(); // Get studentId from URL
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPerformanceData();
    }, []);

    const fetchPerformanceData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { student_id: studentId }, // Send studentId in the request body
            };

            const response = await axios.get(`${baseURL}/api/internal-test/getStudentPerformance`, config);
            setPerformance(response.data.performance);
        } catch (error) {
            console.error('Error fetching performance data:', error);
            toast.error('Error fetching performance data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center"><Spinner animation="border" /></div>;
    }

    if (!performance) {
        return <div>No performance data found.</div>;
    }

    const pieData = [
        { name: 'Marks Obtained', value: performance.total_marks_obtained },
        { name: 'Total Marks Lost', value: performance.total_possible_marks - performance.total_marks_obtained },
    ];

    const COLORS = ['#0088FE', '#FF8042'];

    // Calculate overall performance percentage
    const performancePercentage = (performance.total_marks_obtained / performance.total_possible_marks) * 100;

    // Determine the performance level
    // const performanceLevel = performancePercentage >= 75 ? "Great" :
    //     performancePercentage >= 50 ? "Good" : "Needs Improvement";

    const performanceMessage = performancePercentage >= 75 ?
        "Excellent work! Keep up the outstanding performance." :
        performancePercentage >= 50 ?
            "Good job! You're doing well but there's room for improvement." :
            "Needs improvement. Practice more to improve your score.";

    const performanceColor = performancePercentage >= 75 ? "text-success" :
        performancePercentage >= 50 ? "text-warning" : "text-danger";

    // Get the latest 3 test results
    const latestTestResults = performance.test_results.slice(-3);

    return (
        <Container className="mt-5">
            <h2 className='text-center'>Test Performance Overview</h2>

            {/* Overall Performance Summary */}
            <Row className="text-center mt-4">
                <Col>
                    <h4>Overall Performance Review</h4>
                    <h3 className={`fw-bold ${performanceColor}`}>
                        {performanceMessage}
                    </h3>
                    {/* <p>{performanceMessage}</p> */}
                    <p className="mt-3">
                        You have scored <span className="fw-bold">{performance.total_marks_obtained}</span> out of
                        <span className="fw-bold"> {performance.total_possible_marks}</span> total marks
                        ({performancePercentage.toFixed(2)}%).
                    </p>
                </Col>
            </Row>

            {/* Toast Notification */}
            {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover /> */}

            {/* Performance Summary Table */}
            <Row className="mt-5">
                <Col>
                    <h4 className="mb-4 text-center">Performance Summary</h4>
                    <Row xs={1} md={2} lg={2} className="g-4">
                        <Col>
                            <Card className="h-100 shadow-lg p-3 bg-white rounded text-center">
                                <Card.Body>
                                    <Card.Title className="display-6 text-primary">Total Tests Attended</Card.Title>
                                    <Card.Text className="fs-2 fw-bold">{performance.total_tests_attended}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="h-100 shadow-lg p-3 bg-white rounded text-center">
                                <Card.Body>
                                    <Card.Title className="display-6 text-primary">Total Marks Obtained</Card.Title>
                                    <Card.Text className="fs-2 fw-bold">{performance.total_marks_obtained}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="h-100 shadow-lg p-3 bg-white rounded text-center">
                                <Card.Body>
                                    <Card.Title className="display-6 text-primary">Total Possible Marks</Card.Title>
                                    <Card.Text className="fs-2 fw-bold">{performance.total_possible_marks}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="h-100 shadow-lg p-3 bg-white rounded text-center">
                                <Card.Body>
                                    <Card.Title className="display-6 text-primary">Average Score per Test</Card.Title>
                                    <Card.Text className="fs-2 fw-bold">{performance.average_score_per_test}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Charts Section */}
            <Row className="mt-4">
                {/* Pie Chart */}
                <Col md={6}>
                    <h4>Marks Distribution</h4>
                    <p>This chart shows how your marks are distributed across total possible marks.</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Col>

                {/* Bar Chart */}
                <Col md={6}>
                    <h4>Latest 3 Test Performances</h4>
                    <p>This bar chart shows your performance in the latest 3 tests. Hover to see the details.</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={latestTestResults}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="test_description" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="marks_obtained" fill="#0088FE" name="Marks Obtained" />
                            <Bar dataKey="total_marks" fill="#FF8042" name="Total Marks" />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
        </Container>
    );
};

export default StudentPerformanceDashboard;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Row, Col, Card, Table, ProgressBar, Badge, Spinner } from 'react-bootstrap';
// import { baseURL } from '../config';

// const StudentPerformanceDashboard = () => {
//     const [performance, setPerformance] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchPerformanceDetails();
//     }, []);

//     const fetchPerformanceDetails = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             };
//             const response = await axios.get(`${baseURL}/api/internal-test/getStudentPerformance`, config);
//             setPerformance(response.data.performance);
//         } catch (error) {
//             console.error('Error fetching performance details:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//                 <Spinner animation="border" />
//             </div>
//         );
//     }

//     if (!performance) {
//         return <div>No performance data available</div>;
//     }

//     return (
//         <Container className="mt-5">
//             <h2 className="text-center mb-4">Test Performance Overview</h2>

//             <Row className="mb-4">
//                 <Col lg={4} sm={12}>
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <Card.Title>Total Tests Attended</Card.Title>
//                             <h3>{performance.total_tests_attended}</h3>
//                             <Card.Text>Number of tests the student has attended.</Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col lg={4} sm={12}>
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <Card.Title>Total Marks Obtained</Card.Title>
//                             <h3>{performance.total_marks_obtained}</h3>
//                             <Card.Text>Total marks the student has secured in all tests.</Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col lg={4} sm={12}>
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <Card.Title>Average Score Per Test</Card.Title>
//                             <h3>{performance.average_score_per_test}</h3>
//                             <Card.Text>Average marks per test based on the total performance.</Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             <Row className="mb-4">
//                 <Col>
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <Card.Title>Performance Summary</Card.Title>
//                             <ProgressBar now={(performance.total_marks_obtained / performance.total_possible_marks) * 100}
//                                          label={`${((performance.total_marks_obtained / performance.total_possible_marks) * 100).toFixed(2)}%`} />
//                             <Card.Text className="mt-2">
//                                 {performance.total_marks_obtained} out of {performance.total_possible_marks} marks obtained.
//                             </Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* <Row className="mb-4">
//                 <Col>
//                     <Card className="shadow-sm">
//                         <Card.Body>
//                             <Card.Title>Detailed Test Results</Card.Title>
//                             <Table responsive striped bordered hover className="mt-3">
//                                 <thead>
//                                     <tr>
//                                         <th>Test ID</th>
//                                         <th>Description</th>
//                                         <th>Questions</th>
//                                         <th>Total Marks</th>
//                                         <th>Marks Obtained</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {performance.test_results.map((test) => (
//                                         <tr key={test.internal_test_id}>
//                                             <td>{test.internal_test_id}</td>
//                                             <td>{test.test_description}</td>
//                                             <td>{test.number_of_questions}</td>
//                                             <td>{test.total_marks}</td>
//                                             <td>{test.marks_obtained}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </Table>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row> */}
//         </Container>
//     );
// };

// export default StudentPerformanceDashboard;
