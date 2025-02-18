import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Modal, OverlayTrigger, Tooltip, Pagination, Badge } from 'react-bootstrap';
import { baseURL } from '../config';  // Import your base URL
import UpdateWeeklyTest from './UpdateWeeklyTest'; // Import the UpdateWeeklyTest component
import { BsCopy } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Paginate from '../common/Paginate';

const WeeklyTestList = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);  // For selected test
    const [showModal, setShowModal] = useState(false);  // For modal visibility
    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage] = useState(5);  // Number of tests per page

    // Fetch tests from API
    useEffect(() => {
        const fetchWeeklyTests = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token provided.");

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                const response = await axios.get(`${baseURL}/api/weekly-test/getAllWeeklyTests`, config);
                const sortedTests = response.data.tests.sort((a, b) => b.wt_id - a.wt_id); // Sort by ID, latest first
                setTests(sortedTests);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklyTests();
    }, []);

    // Pagination logic
    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Update the test in the list after editing
    const updateTestInList = (updatedTest) => {
        if (!updatedTest || !updatedTest.wt_id) {
            console.error("Invalid test update");
            return;
        }
    
        setTests(prevTests =>
            prevTests.map(test => test.wt_id === updatedTest.wt_id ? updatedTest : test)
        );
    };

    const handleEditClick = (test) => {
        setSelectedTest(test);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTest(null);
    };

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
    }

    const copyTestLinkToClipboard = (testLink) => {
        navigator.clipboard.writeText(testLink)
            .then(() => {
                toast.info('Test link copied to clipboard');
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
            });
    };

    return (
        <div className="container mt-4">
            <h3>All Weekly Tests</h3>
            {tests.length > 0 ? (
                <Table striped bordered hover responsive className="mt-4">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Link</th>
                            <th>Test Description</th>
                            <th>Topics</th>
                            <th>Edit</th>
                            <th>Results</th>
                            <th>Add Question</th>
                            <th>Edit Question</th>
                            <th>Upload Question</th>
                            <th>Provide Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTests.map((test, index) => (
                            test && test.wt_id ? (
                                <tr key={test.wt_id}>
                                    <td>{index + 1}{index === 0 && <td><Badge variant="success">New</Badge></td>}</td>
                                    <td className="test-link-cell">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id={`tooltip-${test.wt_id}`}>{test.wt_link}</Tooltip>}
                                        >
                                            <p className="test-link-text" style={{ width: 'fit-content', textWrap: 'wrap' }}>{test.wt_link}&nbsp;</p>
                                        </OverlayTrigger>
                                        <button
                                            className="btn btn-link"
                                            onClick={() => copyTestLinkToClipboard(test.wt_link)}
                                        >
                                            <BsCopy />
                                        </button>
                                    </td>
                                    <td>{test.wt_description}</td>
                                    <td>
                                        {test.TestWeekly && test.TestWeekly.length > 0 ? (
                                            <ul>
                                                {test.TestWeekly.map(weeklyTopic => (
                                                    <li key={weeklyTopic.id}>
                                                        {weeklyTopic.TopicAssociation.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No Topics Assigned</span>
                                        )}
                                    </td>
                                    <td>
                                        <Button variant="primary" onClick={() => handleEditClick(test)}>
                                            Edit
                                        </Button>
                                    </td>
                                    <td>
                                        <Link to={`/studentHome/weekly-test-results/${test.wt_id}`}>Results</Link>
                                    </td>
                                    <td>
                                        <Link to={`/add-questoin-weekly-test/${test.wt_id}`}>Add Question</Link>
                                    </td>
                                    <td>
                                        <Link to={`/fetch-questoins-weekly-test/${test.wt_id}`}>Edit Questions</Link>
                                    </td>
                                    <td>
                                        <Link to={`/upload-questoins-weekly-test/${test.wt_id}`}>Upload Questions</Link>
                                    </td>
                                    <td>
                                        <Link to={`/test-answer-form/${test.wt_id}`}>Provide answer</Link>
                                    </td>
                                    
                                </tr>
                            ) : null
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant="info" className="mt-4 text-center">
                    No Weekly Tests Found
                </Alert>
            )}

                    <Paginate
                        currentPage={currentPage}
                        totalItems={tests.length}
                        itemsPerPage={testsPerPage}
                        onPageChange={paginate}
                    />

            {/* Pagination */}
            {/* <Pagination>
                {[...Array(Math.ceil(tests.length / testsPerPage)).keys()].map((num) => (
                    <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => paginate(num + 1)}>
                        {num + 1}
                    </Pagination.Item>
                ))}
            </Pagination> */}

            {/* Modal to edit selected weekly test */}
            {selectedTest && (
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Weekly Test</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <UpdateWeeklyTest test={selectedTest} onClose={handleCloseModal} onUpdate={updateTestInList} />
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default WeeklyTestList;
