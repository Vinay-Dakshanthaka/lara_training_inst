// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Table, Badge, Container, Button } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { baseURL } from '../config';
// import { Link } from 'react-router-dom';
// import Paginate from '../../components/common/Paginate';

// const ITEMS_PER_PAGE = 5; // Adjust the number of items per page

// const StudentInternalTestDetails = () => {
//     const [tests, setTests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(ITEMS_PER_PAGE);

//     useEffect(() => {
//         fetchTestDetails();
//     }, []);

//     const fetchTestDetails = async () => {
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

//             const response = await axios.get(`${baseURL}/api/internal-test/getStudentInternalTestDetails`, config);

//             console.log("API Response:", response.data); // Debugging log

//             if (!response.data || !response.data.internalTests) {
//                 throw new Error("Invalid response structure");
//             }

//             const formattedTests = response.data.internalTests.map(test => ({
//                 ...test,
//                 formatted_date: new Date(test.test_date).toISOString().split('T')[0]
//             }));

//             setTests(formattedTests);
//         } catch (error) {
//             console.error('Error fetching test details:', error);
//             toast.error('Error fetching test details');
//         } finally {
//             setLoading(false);
//         }
//     };    

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     // Pagination logic
//     const indexOfLastTest = currentPage * itemsPerPage;
//     const indexOfFirstTest = indexOfLastTest - itemsPerPage;
//     const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest); // Paginated tests
//     const totalPages = Math.ceil(tests.length / itemsPerPage);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <Container className="mt-5">
//             <h2 className="text-center">Your Test Details</h2>
//             <Table striped bordered hover responsive className="mt-4">
//                 <thead>
//                     <tr>
//                         <th>Test Link</th>
//                         <th>Number of Questions</th>
//                         <th>Date</th>
//                         <th>Status</th>
//                         <th>Total Marks</th>
//                         <th>Marks Obtained</th>
//                         <th>Detailed Summary</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {currentTests
//                         .filter((test) => test.is_active) // Filter out inactive tests
//                         .map((test) => (
//                             <tr key={test.internal_test_id}>
//                                 <td>
//                                     <a href={test.internal_test_link} target="_blank" rel="noopener noreferrer">
//                                         {test.test_description}
//                                     </a>
//                                 </td>
//                                 <td>{test.number_of_questions}</td>
//                                 <td>{test.formatted_date}</td> {/* Display formatted date */}
//                                 <td>
//                                     {test.attended ? (
//                                         <span className="text-success">Attended</span>
//                                     ) : (
//                                         <Badge bg="danger">Not Attended</Badge>
//                                     )}
//                                 </td>
//                                 <td>
//                                     {test.attended ? <span>{test.attended.total_marks}</span> : <span>-</span>}
//                                 </td>
//                                 <td>
//                                     {test.attended ? <span>{test.attended.marks_obtained}</span> : <span>-</span>}
//                                 </td>
//                                 <td>
//                                     {test.attended && (
//                                         <Link to={`/detailed-internal-result/${test.internal_test_id}`}>
//                                             <Button variant="info">View</Button>
//                                         </Link>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                 </tbody>
//             </Table>

//             {/* Pagination */}
//             <Paginate
//                 currentPage={currentPage}
//                 totalItems={tests.length}
//                 itemsPerPage={itemsPerPage}
//                 onPageChange={handlePageChange}
//             />
//         </Container>
//     );
// };

// export default StudentInternalTestDetails;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Badge, Container, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import { Link } from 'react-router-dom';
import Paginate from '../../components/common/Paginate';

const ITEMS_PER_PAGE = 5;

const StudentInternalTestDetails = () => {
    const [combinedTests, setCombinedTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(ITEMS_PER_PAGE);
    const [studentDetails, setStudentDetails] = useState(null);

    useEffect(() => {
        fetchCombinedTests();
    }, []);

    // Fetch both Weekly and Internal Tests
    const fetchCombinedTests = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token provided.");

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const [weeklyRes, internalRes] = await Promise.all([
                axios.get(`${baseURL}/api/weekly-test/getStudentAndActiveTestsWithAttendance`, config),
                axios.get(`${baseURL}/api/internal-test/getStudentInternalTestDetails`, config),
            ]);

            const studentid = weeklyRes.data.student.student_id;
            setStudentDetails(weeklyRes.data.student);

            const weeklyTests = await Promise.all(
                weeklyRes.data.active_tests
                    .filter(test => test.is_active && test.testType === true)
                    .map(async (test) => {
                        const response = await axios.get(
                            `${baseURL}/api/weekly-test/getAllIndividualStudentResultsForTest/${test.test_id}`
                        );
                        const studentResult = response.data.student_results.find(
                            (result) => result.student_id === studentid
                        );
                        const isAnswerDisplayed = response.data.weekly_test.isAnswerDisplayed;
                        const isResultsVisible = response.data.weekly_test.isResultsVisible;
                        let finalSubmission = false;

                        if (studentResult) {
                            const submissionResponse = await axios.post(
                                `${baseURL}/api/weekly-test/checkAndSubmitTest`,
                                { student_id: studentid, wt_id: test.test_id },
                                config
                            );
                            finalSubmission = submissionResponse.data.result?.final_submission || false;
                            // console.log(submissionResponse,"-------------------submisio")

                        }

                        return {
                            ...test,
                            testType: "weekly",
                            has_attended: !!studentResult,
                            obtained_marks: studentResult?.obtained_marks ?? "Pending",
                            total_available_marks: studentResult?.total_available_marks ?? "N/A",
                            final_submission: finalSubmission,
                            isAnswerDisplayed: isAnswerDisplayed,
                            isResultsVisible: isResultsVisible,
                        };
                    })
            );

            const internalTests = internalRes.data.internalTests.map(test => ({
                ...test,
                testType: "internal",
                formatted_date: new Date(test.test_date).toISOString().split('T')[0]
            }));

            setCombinedTests([...weeklyTests, ...internalTests]);
        } catch (error) {
            console.error('Error fetching tests:', error);
            toast.error('Error fetching tests');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastTest = currentPage * itemsPerPage;
    const indexOfFirstTest = indexOfLastTest - itemsPerPage;
    const currentTests = combinedTests.slice(indexOfFirstTest, indexOfLastTest);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center">Your Test Details</h2>
            <Table striped bordered hover responsive className="mt-4">
                <thead>
                    <tr>
                        <th>Test Description</th>
                        <th>Test Date</th>
                        <th>Total Marks</th>
                        <th>Obtained Marks</th>
                        <th>Status</th>
                        <th>Detailed Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTests.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">No active tests available.</td>
                        </tr>
                    ) : (
                        currentTests.map((test, index) => (
                            <tr key={`${test.test_id || test.internal_test_id}-${index}`}>
                                <td>
                                    <a href={test.test_link || test.internal_test_link} target="_blank">
                                        {test.test_description}
                                    </a>
                                </td>
                                <td>
                                    {test.test_date
                                        ? new Date(test.test_date).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })
                                        : new Date(test.formatted_date).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                </td>
                                <td>
                                    {test.testType === "weekly"
                                        ? test.final_submission
                                            ? test.total_available_marks
                                            : "-"
                                        : test.attended
                                            ? test.attended.total_marks
                                            : "-"}
                                </td>
                                <td>
                                    {test.testType === "weekly"
                                        ? test.final_submission && test.isResultsVisible
                                            ? test.obtained_marks
                                            : "-"
                                        : test.attended
                                            ? test.attended.marks_obtained
                                            : "-"}
                                </td>
                                <td>
                                    <Badge bg={
                                        test.testType === "weekly"
                                            ? test.final_submission
                                                ? "primary"
                                                : test.has_attended ? "warning" : "danger"
                                            : test.attended
                                                ? "success"
                                                : "danger"
                                    }>
                                        {test.testType === "weekly"
                                            ? test.final_submission
                                                ? "Submitted"
                                                : test.has_attended ? "pending" : "Not Attended"
                                            : test.attended
                                                ? "Attended"
                                                : "Not Attended"}
                                    </Badge>
                                </td>
                                <td>
                                    {test.testType === "weekly" && test.final_submission && test.isAnswerDisplayed ? (
                                        <Link
                                            to={`weeklytest-detailed-summary/${test.test_id}`}
                                            className="btn btn-outline-info">
                                            View
                                        </Link>
                                    ) : test.testType === "internal" && test.attended ? (
                                        <Link to={`/detailed-internal-result/${test.internal_test_id}`}>
                                            <Button variant="info">View</Button>
                                        </Link>
                                    ) : null}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            </Table>

            <Paginate
                currentPage={currentPage}
                totalItems={combinedTests.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </Container>
    );
};

export default StudentInternalTestDetails;
