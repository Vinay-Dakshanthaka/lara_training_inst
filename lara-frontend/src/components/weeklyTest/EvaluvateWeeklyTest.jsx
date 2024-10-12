import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { baseURL } from '../config';  // Import your base URL
import UpdateWeeklyTest from './UpdateWeeklyTest'; // Import the UpdateWeeklyTest component
import { BsCopy } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const EvaluvateWeeklyTest = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);  // For selected test
    const [showModal, setShowModal] = useState(false);  // For modal visibility

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
                setTests(response.data.tests);
                // console.log(response.data)
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklyTests();
    }, []);

    // Function to update the test in the list
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
        setSelectedTest(test);  // Set the selected test
        setShowModal(true);     // Show the modal
    };

    const handleCloseModal = () => {
        setShowModal(false);    // Close the modal
        setSelectedTest(null);  // Reset selected test
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
                            {/* <th>Test Date</th> */}
                            {/* <th>Number of Questions</th> */}
                            <th>Topics</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {tests && tests.map((test, index) => (
                            test && test.wt_id ? (  // Check if test and wt_id exist before rendering
                                <tr key={test.wt_id}>
                                    <td>{index + 1}</td>
                                    <td className="test-link-cell">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-${test.wt_id}`}>{test.wt_link}</Tooltip>}
                                    >
                                        <p className="test-link-text" style={{ width: 'fit-content', textWrap: 'wrap' }}>{test.wt_link}&nbsp;</p>
                                    </OverlayTrigger>
                                    {/* {test.is_Active && ( */}
                                        <button
                                            className="btn btn-link"
                                            onClick={() => copyTestLinkToClipboard(test.wt_link)}
                                        >
                                            <BsCopy />
                                        </button>
                                    {/* )} */}
                                </td>
                                    <td>{test.wt_description}</td>
                                    {/* <td>{new Date(test.test_date).toLocaleDateString()}</td> */}
                                    {/* <td>{test.no_of_questions}</td> */}
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
                                    {/* <td>{test.is_active ? 'Active' : 'Inactive'}</td> */}
                                    <td>
                                        <Button variant="primary" onClick={() => handleEditClick(test)}>
                                            Edit
                                        </Button>
                                    </td>
                                    <td>
                                        <Link to={`/wt-attended-student-list/${test.wt_id}`}>Students List</Link>
                                    </td>
                                </tr>
                            ) : null  // Skip undefined or invalid test
                        ))}
                    </tbody>

                </Table>
            ) : (
                <Alert variant="info" className="mt-4 text-center">
                    No Weekly Tests Found
                </Alert>
            )}

            {/* Modal to edit selected weekly test */}
            {selectedTest && (
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Weekly Test</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Pass selected test data and update callback to UpdateWeeklyTest component */}
                        <UpdateWeeklyTest test={selectedTest} onClose={handleCloseModal} onUpdate={updateTestInList} />
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default EvaluvateWeeklyTest;
