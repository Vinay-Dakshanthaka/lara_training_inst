import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { baseURL } from '../config';  // Import your base URL
import UpdateWeeklyTest from '../../components/weeklyTest/UpdateWeeklyTest'; // Import the UpdateWeeklyTest component
import { BsCopy } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Paginate from '../common/Paginate';

const EvaluateInternalTest = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const testsPerPage = 5;

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
                
                // Filter tests based on testlink.testType === true
                const filteredTests = response.data.tests.filter(test => test.testType === true);
                setTests(filteredTests);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklyTests();
    }, []);

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

    const sortedTests = [...tests].sort((a, b) => b.wt_id - a.wt_id);

    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = sortedTests.slice(indexOfFirstTest, indexOfLastTest);

    return (
        <div className="container mt-4">
            <h3>All Weekly Tests (Test Type: True)</h3>
            {tests.length > 0 ? (
                <>
                <Table striped bordered hover responsive className="mt-4">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Link</th>
                            <th>Test Description</th>
                            <th>Topics</th>
                            <th>Edit</th>
                            <th>Evaluation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTests.map((test, index) => (
                            test && test.wt_id ? (
                                <tr key={test.wt_id}>
                                    <td>{indexOfFirstTest + index + 1}</td>

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
                                        <Link to={`/wt-attended-student-list/${test.wt_id}`}>Students List</Link>
                                    </td>
                                </tr>
                            ) : null
                        ))}
                    </tbody>
                </Table>
                <Paginate
                    itemsPerPage={testsPerPage}
                    totalItems={tests.length}
                    onPageChange={setCurrentPage}
                    currentPage={currentPage}
                />
                </>
            ) : (
                <Alert variant="info" className="mt-4 text-center">
                    No Weekly Tests Found
                </Alert>
            )}

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

export default EvaluateInternalTest;
