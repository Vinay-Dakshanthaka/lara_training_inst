import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { Link } from 'react-router-dom';
import { BsCopy, BsPencil } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Badge, Modal, Button, Form } from 'react-bootstrap';
import { toast, ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './allPlacementTest.css';

const AllPlacementTests = () => {
    const [placementTests, setPlacementTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [newQuestionCount, setNewQuestionCount] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPlacementTests = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
                const sortedTests = response.data.placementTests.sort((a, b) => b.is_Active - a.is_Active);
                setPlacementTests(sortedTests);
            } catch (error) {
                console.error('Error fetching placement tests:', error);
            }
        };

        fetchPlacementTests();

        return () => {
            toast.dismiss();
        };
    }, []);

    const copyTestLinkToClipboard = (testLink) => {
        navigator.clipboard.writeText(testLink)
            .then(() => {
                toast.info('Test link copied to clipboard');
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
            });
    };

    const activateLink = async (placement_test_id) => {
        try {
            await axios.post(`${baseURL}/api/placement-test/disable-link`, {
                test_id: placement_test_id,
                is_Active: true
            });
            toast.success('Link activated successfully');
            const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
            const sortedTests = response.data.placementTests.sort((a, b) => b.is_Active - a.is_Active);
            setPlacementTests(sortedTests);
        } catch (error) {
            console.error('Error activating link:', error);
            toast.error('Failed to activate link');
        }
    };

    const handleEditClick = (test) => {
        setSelectedTest(test);
        setNewQuestionCount(test.number_of_questions);
        setShowModal(true);
    };

    const handleSaveQuestions = async () => {
        try {
            await axios.post(`${baseURL}/api/placement-test/updateNumberOfQuestions`, {
                test_id: selectedTest.placement_test_id,
                number_of_questions: newQuestionCount
            });
            toast.success('Number of questions updated successfully');
            setShowModal(false);
            const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
            setPlacementTests(response.data.placementTests);
        } catch (error) {
            console.error('Error updating number of questions:', error);
            toast.error('Failed to update number of questions');
        }
    };

    const handleMonitoredChange = async (test) => {
        try {
            const updatedStatus = !test.is_Monitored;
            await axios.post(`${baseURL}/api/placement-test/updateIsMonitored`, {
                test_id: test.placement_test_id,
                is_Monitored: updatedStatus
            });
            const updatedTests = placementTests.map(t =>
                t.placement_test_id === test.placement_test_id ? { ...t, is_Monitored: updatedStatus } : t
            );
            setPlacementTests(updatedTests);
            if (updatedStatus) {
                alert('Camera monitoring for this test is turned on');
            }
        } catch (error) {
            console.error('Error updating monitored status:', error);
            toast.error('Failed to update monitored status');
        }
    };

    return (
        <div className="container mt-5">
            <ToastifyContainer />
            <h2>All Placement Tests</h2>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th style={{ width: 'fit-content' }}>Test Link</th>
                            <th>Number of Questions</th>
                            <th>Camera Monitoring</th>
                            <th>Results</th>
                            <th>Add Existing Questions</th>
                            <th>Add New Questions</th>
                            <th>Upload Questions</th>
                            <th>Edit Questions</th>
                            <th>Activate Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {placementTests.map(test => (
                            <tr key={test.placement_test_id} className={test.is_Active ? 'table-success animate-to-top' : ''}>
                                <td>{test.placement_test_id} {test.placement_test_id === Math.max(...placementTests.map(t => t.placement_test_id)) && <Badge bg="info">New</Badge>}</td>
                                <td className="test-link-cell">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-${test.placement_test_id}`}>{test.test_link}</Tooltip>}
                                    >
                                        <p className="test-link-text" style={{ width: 'fit-content', textWrap: 'wrap' }}>{test.test_link}&nbsp;</p>
                                    </OverlayTrigger>
                                    {test.is_Active && (
                                        <button
                                            className="btn btn-link"
                                            onClick={() => copyTestLinkToClipboard(test.test_link)}
                                        >
                                            <BsCopy />
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {test.number_of_questions}
                                    <button  className='btn btn-outline-secondary m-1'>
                                    <BsPencil onClick={() => handleEditClick(test)} className="" />
                                    </button>
                                </td>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={test.is_Monitored}
                                        onChange={() => handleMonitoredChange(test)}
                                    />
                                </td>
                                <td>
                                    <Link to={`/get-result/${test.placement_test_id}`}>
                                        Results
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/add-questions-tolink/${test.placement_test_id}`}>
                                        Add Existing Questions
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/add-new-questions/${test.placement_test_id}`}>
                                        Add New Questions
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/upload-excel-link/${test.placement_test_id}`}>
                                        Upload Questions
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/edit-quesitons/${test.placement_test_id}`}>
                                        Edit Questions
                                    </Link>
                                </td>
                                <td>
                                    {!test.is_Active && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => activateLink(test.placement_test_id)}
                                        >
                                            Activate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Number of Questions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Number of Questions</Form.Label>
                        <Form.Control
                            type="number"
                            value={newQuestionCount}
                            onChange={(e) => setNewQuestionCount(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveQuestions}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllPlacementTests;
