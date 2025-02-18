import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { Link } from 'react-router-dom';
import { NavLink, Navigate,useNavigate } from 'react-router-dom';
import { BsCopy, BsPencil } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Badge, Modal, Button, Form } from 'react-bootstrap';
import { toast, ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './allInternalTests.css'; // Un-comment if you have styles
import { BsTrash } from 'react-icons/bs';



const AllInternalTests = () => {
    const [internalTests, setInternalTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [newQuestionCount, setNewQuestionCount] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newShowResult, setNewShowResult] = useState(false);
    const [newIsMonitored, setNewIsMonitored] = useState(false);
    const [newIsActive, setNewIsActive] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Adjust as needed

    const navigate = useNavigate();

    
    useEffect(() => {
        const fetchInternalTests = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/internal-test/getAllInternalTests`);
                const sortedTests = response.data.internalTests.sort((a, b) => {
                    if (a.is_active === b.is_active) {
                        return b.internal_test_id - a.internal_test_id;
                    }
                    return b.is_active - a.is_active;
                });
                setInternalTests(sortedTests);
            } catch (error) {
                console.error('Error fetching internal tests:', error);
            }
        };

        fetchInternalTests();
        return () => {
            toast.dismiss();
        };
    }, []);

    const handleEditClick = (test) => {
        setSelectedTest(test);
        setNewQuestionCount(test.number_of_questions);
        setNewDescription(test.test_description);
        setNewShowResult(test.show_result);
        setNewIsMonitored(test.is_monitored);
        setNewIsActive(test.is_active);
        setShowModal(true);
    };

    const handleSaveTestDetails = async () => {
        try {
            await axios.put(`${baseURL}/api/internal-test/updateInternalTestLink/${selectedTest.internal_test_id}`, {
                number_of_questions: newQuestionCount,
                test_description: newDescription,
                show_result: newShowResult,
                is_monitored: newIsMonitored,
                is_active: newIsActive
            });
            toast.success('Test details updated successfully');
            setShowModal(false);
            const response = await axios.get(`${baseURL}/api/internal-test/getAllInternalTests`);
            setInternalTests(response.data.internalTests);
        } catch (error) {
            console.error('Error updating test details:', error);
            toast.error('Failed to update test details');
        }
    };

    const handleMonitoredChange = async (test) => {
        try {
            const updatedStatus = !test.is_monitored;
            await axios.put(`${baseURL}/api/internal-test/updateInternalTestLink/${test.internal_test_id}`, {
                internal_test_id: test.internal_test_id,
                is_monitored: updatedStatus
            });
            const updatedTests = internalTests.map(t =>
                t.internal_test_id === test.internal_test_id ? { ...t, is_monitored: updatedStatus } : t
            );
            setInternalTests(updatedTests);
            if (updatedStatus) {
                alert('Camera monitoring for this test is turned on');
            }
        } catch (error) {
            console.error('Error updating monitored status:', error);
            toast.error('Failed to update monitored status');
        }
    };

    const handleActiveChange = async (test) => {
        try {
            const updatedStatus = !test.is_active;
            await axios.put(`${baseURL}/api/internal-test/updateInternalTestLink/${test.internal_test_id}`, {
                internal_test_id: test.internal_test_id,
                is_active: updatedStatus
            });
            const updatedTests = internalTests.map(t =>
                t.internal_test_id === test.internal_test_id ? { ...t, is_active: updatedStatus } : t
            );
            setInternalTests(updatedTests);
        } catch (error) {
            console.error('Error updating active status:', error);
            toast.error('Failed to update active status');
        }
    };

    const deassignTestLink = async (internal_test_id) => {
        try {
          const response = await axios.delete(`${baseURL}/api/internal-test/deleteinternaltest/${internal_test_id}`);
    
          console.log(response.data, "------------------------------response data");
          toast.success(response.data.message);
          alert("Test Link Deleted Successfully....")
        } catch (error) {
          console.error('Error deleting internal test:', error);
          
          toast.error('An error occurred while deleting the test.');
          alert("An error occurred while deleting the test.")
        }
      };
  

    const copyLinkToClipboard = (link) => {
        navigator.clipboard.writeText(link)
            .then(() => {
                toast.info('Link copied to clipboard');
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
                toast.error('Failed to copy link');
            });
    };

    // Pagination logic
    const indexOfLastTest = currentPage * itemsPerPage;
    const indexOfFirstTest = indexOfLastTest - itemsPerPage;
    const currentTests = internalTests.slice(indexOfFirstTest, indexOfLastTest);
    const totalPages = Math.ceil(internalTests.length / itemsPerPage);

     // This function will be triggered when the button is clicked
  const handleBatches = (internalTestId) => {
    // Navigate to the BatchDetails component with the internal_test_id as a URL parameter
    navigate(`/batch-details/${internalTestId}`);
  };
    
 

    return (
        <div className="container mt-5 responsive">
            <ToastifyContainer />
            <h2>All Internal Tests</h2>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th style={{ width: 'fit-content' }}>Test Link</th>
                            <th>Number of Questions</th>
                            <th>Edit</th>
                            <th>Assign Batchs</th>
                            <th>Results</th>
                            <th>Assign Questions</th>
                            <th>Add New Questions </th>
                            <th>Upload Questions </th>
                            <th>Edit Questions </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTests.map(test => (
                            <tr key={test.internal_test_id} className={test.is_active ? 'table-success animate-to-top' : ''}>
                                <td>
                                    {test.internal_test_id}
                                    {test.internal_test_id === Math.max(...internalTests.map(t => t.internal_test_id)) && <Badge bg="info">New</Badge>}
                                </td>
                                <td className="test-link-cell">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-${test.internal_test_id}`}>{test.internal_test_link}</Tooltip>}
                                    >
                                        <p className="test-link-text" style={{ width: 'fit-content', textWrap: 'wrap' }}>
                                            {/* {test.internal_test_link}&nbsp; */}
                                            {test.test_description ? test.test_description : "N/A"}&nbsp;
                                            <button
                                                className="btn btn-link"
                                                onClick={() => copyLinkToClipboard(test.internal_test_link)}
                                                aria-label="Copy link"
                                            >
                                                <BsCopy />
                                            </button>
                                        </p>
                                    </OverlayTrigger>
                                </td>
                                <td>
                                    {test.number_of_questions}
                                    <button className='btn btn-outline-secondary m-1'>
                                        <BsPencil onClick={() => handleEditClick(test)} className="" />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => handleEditClick(test)}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                          <button
                          onClick={() => handleBatches(test.internal_test_id)} 
                          className="btn btn-success"
                          >
                          View Batch Details
                          </button>

                          </td>
                                <td>
                                    <Link to={`/get-internal-test-result/${test.internal_test_id}`} className="btn btn-primary">
                                        Results
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/assign-questions-internal-test/${test.internal_test_id}`} className="btn btn-primary">
                                        Add Existing Questions
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/add-questions-internal-test/${test.internal_test_id}`} className="btn btn-primary">
                                        Add New Questions
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/upload-excel-internal-test-link/${test.internal_test_id}`} className="btn btn-primary">
                                        Upload Questions
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/edit-internal-quesitons/${test.internal_test_id}`} className="btn btn-primary">
                                        Edit Questions
                                    </Link>
                                </td>
                                <td><button
                                   className="btn btn-danger ms-2 m-1"
                                  onClick={() => deassignTestLink(test.internal_test_id)}
                                  >
                                <BsTrash />
                                </button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Test Details</Modal.Title>
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
                    <Form.Group className="mt-3">
                        <Form.Label>Test Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Show Result"
                            checked={newShowResult}
                            onChange={(e) => setNewShowResult(e.target.checked)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Camera Monitoring"
                            checked={newIsMonitored}
                            onChange={(e) => setNewIsMonitored(e.target.checked)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Active"
                            checked={newIsActive}
                            onChange={(e) => setNewIsActive(e.target.checked)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveTestDetails}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllInternalTests;
