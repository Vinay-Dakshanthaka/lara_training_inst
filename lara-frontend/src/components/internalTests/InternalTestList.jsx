// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table, Spinner, Alert, Button, Modal, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
// import { baseURL } from '../config';
// import UpdateWeeklyTest from '../weeklyTest/UpdateWeeklyTest';
// import { BsCopy, BsTrash } from 'react-icons/bs';
// import { toast } from 'react-toastify';
// import { Link, useNavigate } from 'react-router-dom';
// import Paginate from '../common/Paginate';

// const InternalTestList = () => {
//     const [tests, setTests] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [selectedTest, setSelectedTest] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [testsPerPage] = useState(5);

//     const navigate = useNavigate();

//     // Fetch tests from API
//     useEffect(() => {
//         const fetchWeeklyTests = async () => {
//             setLoading(true);
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) throw new Error("No token provided.");

//                 const config = {
//                     headers: { Authorization: `Bearer ${token}` },
//                 };

//                 const response = await axios.get(`${baseURL}/api/weekly-test/getAllWeeklyTests`, config);
//                 console.log(response.data.tests, "--------------------------------data");

//                 // Filter tests where testType is true
//                 const filteredTests = response.data.tests.filter(test => test.testType === true);

//                 if (filteredTests.length > 0) {
//                     const sortedTests = filteredTests.sort((a, b) => b.wt_id - a.wt_id);
//                     setTests(sortedTests);
//                 } else {
//                     setTests([]);
//                 }
//             } catch (err) {
//                 setError(err.response?.data?.message || err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchWeeklyTests();
//     }, []);

//     const indexOfLastTest = currentPage * testsPerPage;
//     const indexOfFirstTest = indexOfLastTest - testsPerPage;
//     const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     const updateTestInList = (updatedTest) => {
//         if (!updatedTest || !updatedTest.wt_id) {
//             console.error("Invalid test update");
//             return;
//         }
//         setTests(prevTests =>
//             prevTests.map(test => test.wt_id === updatedTest.wt_id ? updatedTest : test)
//         );
//     };

//     const handleEditClick = (test) => {
//         setSelectedTest(test);
//         setShowModal(true);
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//         setSelectedTest(null);
//     };

//     const copyTestLinkToClipboard = (testLink) => {
//         navigator.clipboard.writeText(testLink)
//             .then(() => toast.info('Test link copied to clipboard'))
//             .catch((error) => console.error('Error copying to clipboard:', error));
//     };

//     const deassignTestLink = async (wt_id) => {
//         try {
//             const response = await axios.delete(`${baseURL}/api/weekly-test/deleteinternaltests/${wt_id}`);
//             console.log(response.data, "------------------------------response data");
//             toast.success(response.data.message);
//             alert("Test Link Deleted Successfully...");
//         } catch (error) {
//             console.error('Error deleting internal test:', error);
//             alert("Error deleting internal test");
//             toast.error('An error occurred while deleting the test.');
//         }
//     };

//     const handleBatches = (wt_id) => {
//         navigate(`/batch-details-wt/${wt_id}`);
//     };

//     if (loading) {
//         return <div className="text-center mt-5"><Spinner animation="border" /></div>;
//     }

//     if (error) {
//         return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
//     }

//     return (
//         <div className="container mt-4">
//             <h3>All Weekly Tests</h3>
//             {tests.length > 0 ? (
//                 <Table striped bordered hover responsive className="mt-4">
//                     <thead>
//                         <tr>
//                             <th>#</th>
//                             <th>Link</th>
//                             <th>Test Description</th>
//                             <th>Topics</th>
//                             <th>Edit</th>
//                             <th>View Batches</th>
//                             <th>Results</th>
//                             <th>Add Question</th>
//                             <th>Edit Question</th>
//                             <th>Upload Question</th>
//                             <th>Provide Answer</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentTests.map((test, index) => (
//                             test && test.wt_id ? (
//                                 <tr key={test.wt_id}>
//                                     <td>{index + 1}{index === 0 && <td><Badge variant="success">New</Badge></td>}</td>
//                                     <td>
//                                         <OverlayTrigger placement="top" overlay={<Tooltip>{test.wt_link}</Tooltip>}>
//                                             <p style={{ width: 'fit-content', textWrap: 'wrap' }}>{test.wt_link}&nbsp;</p>
//                                         </OverlayTrigger>
//                                         <button className="btn btn-link" onClick={() => copyTestLinkToClipboard(test.wt_link)}>
//                                             <BsCopy />
//                                         </button>
//                                     </td>
//                                     <td>{test.wt_description}</td>
//                                     <td>
//                                         {test.TestWeekly?.length > 0 ? (
//                                             <ul>
//                                                 {test.TestWeekly.map(weeklyTopic => (
//                                                     <li key={weeklyTopic.id}>{weeklyTopic.TopicAssociation.name}</li>
//                                                 ))}
//                                             </ul>
//                                         ) : <span>No Topics Assigned</span>}
//                                     </td>
//                                     <td><Button onClick={() => handleEditClick(test)}>Edit</Button></td>
//                                     <td><button onClick={() => handleBatches(test.wt_id)} className="btn btn-success">View Batch Details</button></td>
//                                     <td><Link to={`/studentHome/weekly-test-results/${test.wt_id}`}>Results</Link></td>
//                                     <td><Link to={`/add-questoin-weekly-test/${test.wt_id}`}>Add Question</Link></td>
//                                     <td><Link to={`/fetch-questoins-weekly-test/${test.wt_id}`}>Edit Questions</Link></td>
//                                     <td><Link to={`/upload-questoins-weekly-test/${test.wt_id}`}>Upload Questions</Link></td>
//                                     <td><Link to={`/test-answer-form/${test.wt_id}`}>Provide Answer</Link></td>
//                                     <td>
//                                         <button className="btn btn-danger ms-2 m-1" onClick={() => deassignTestLink(test.wt_id)}>
//                                             <BsTrash />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ) : null
//                         ))}
//                     </tbody>
//                 </Table>
//             ) : (
//                 <Alert variant="info" className="mt-4 text-center">No Weekly Tests Found</Alert>
//             )}

//             <Paginate
//                 currentPage={currentPage}
//                 totalItems={tests.length}
//                 itemsPerPage={testsPerPage}
//                 onPageChange={paginate}
//             />

//             {selectedTest && (
//                 <Modal show={showModal} onHide={handleCloseModal} size="lg">
//                     <Modal.Header closeButton>
//                         <Modal.Title>Edit Weekly Test</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <UpdateWeeklyTest test={selectedTest} onClose={handleCloseModal} onUpdate={updateTestInList} />
//                     </Modal.Body>
//                 </Modal>
//             )}
//         </div>
//     );
// };

// export default InternalTestList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Modal, OverlayTrigger, Tooltip, Badge,Form } from 'react-bootstrap';
import { baseURL } from '../config';
import UpdateWeeklyTest from '../weeklyTest/UpdateWeeklyTest';
import { BsCopy, BsTrash } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify'; 
import { Link, useNavigate } from 'react-router-dom';
import Paginate from '../common/Paginate';

const InternalTestList = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage] = useState(5);

    const navigate = useNavigate();

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
                // console.log(response.data.tests, "--------------------------------data");

                // Filter tests where testType is true
                const filteredTests = response.data.tests.filter(test => test.testType === true);

                if (filteredTests.length > 0) {
                    const sortedTests = filteredTests.sort((a, b) => b.wt_id - a.wt_id);
                    setTests(sortedTests);
                } else {
                    setTests([]);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklyTests();
    }, []);

    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    const copyTestLinkToClipboard = (testLink) => {
        navigator.clipboard.writeText(testLink)
            .then(() => toast.info('Test link copied to clipboard'))
            .catch((error) => console.error('Error copying to clipboard:', error));
    };

    const deassignTestLink = async (wt_id) => {
        try {
            const response = await axios.delete(`${baseURL}/api/weekly-test/deleteinternaltests/${wt_id}`);
            // console.log(response.data, "------------------------------response data");
            toast.success(response.data.message);
            alert("Test Link Deleted Successfully...");
        } catch (error) {
            console.error('Error deleting internal test:', error);
            alert("Error deleting internal test");
            toast.error('An error occurred while deleting the test.');
        }
    };

    const handleBatches = (wt_id) => {
        navigate(`/batch-details-wt/${wt_id}`);
    };

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
    }

    const handleShowAnswerChange = async (test) => {
        const updatedAnswerDisplayed = !test.isAnswerDisplayed;
    
        try {
            const response = await axios.put(`${baseURL}/api/weekly-test/updateShowAnswersStatus`, {
                wt_id: test.wt_id,
                isAnswerDisplayed: updatedAnswerDisplayed,
            });
    
            if (response.status === 200) {
                // Immediately update the checkbox status in the UI
                setTests(prevTests =>
                    prevTests.map(t =>
                        t.wt_id === test.wt_id
                            ? { ...t, isAnswerDisplayed: updatedAnswerDisplayed } // Update the correct property
                            : t
                    )
                );
    
                toast.success(updatedAnswerDisplayed ? 'Answers are now visible.' : 'Answers are hidden.');
            } else {
                toast.error('Failed to update show answers status.');
            }
        } catch (error) {
            console.error('Failed to update show answers status:', error);
            toast.error('Failed to update show answers status.');
        }
    };
    
    const handleShowResultChange = async (test) => {
        const updatedResultDisplayed = !test.isResultsVisible;
    
        try {
            const response = await axios.put(`${baseURL}/api/weekly-test/isResultsVisible`, {
                wt_id: test.wt_id,
                isResultsVisible: updatedResultDisplayed,
            });
    
            if (response.status === 200) {
                // Immediately update the checkbox status in the UI
                setTests(prevTests =>
                    prevTests.map(t =>
                        t.wt_id === test.wt_id
                            ? { ...t, isResultsVisible: updatedResultDisplayed } // Update the correct property
                            : t
                    )
                );
    
                toast.success(updatedResultDisplayed ? 'Results are now visible.' : 'Results are hidden.');
            } else {
                toast.error('Failed to update show Results status.');
            }
        } catch (error) {
            console.error('Failed to update show Results status:', error);
            toast.error('Failed to update show Results status.');
        }
    };
    return (
        <>
           <ToastContainer />
        <div className="container mt-4">
            <h3>Internal Tests</h3>
            {tests.length > 0 ? (
                <Table striped bordered hover responsive className="mt-4">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Link</th>
                            <th>Test Description</th>
                            <th>Topics</th>
                            <th>Edit</th>
                            <th>View Batches</th>
                            <th>Results</th>
                            <th>Add Question</th>
                            <th>Edit Question</th>
                            <th>Upload Question</th>
                            <th>Provide Answer</th>
                            <th>Answer Visibility Status</th>
                            <th>Results Visibility Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTests.map((test, index) => (
                            test && test.wt_id ? (
                                <tr key={test.wt_id}>
                                    <td>{index + 1}{index === 0 && <td><Badge variant="success">New</Badge></td>}</td>
                                    <td>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>{test.wt_link}</Tooltip>}>
                                            <p style={{ width: 'fit-content', textWrap: 'wrap' }}>{test.wt_link}&nbsp;</p>
                                        </OverlayTrigger>
                                        <button className="btn btn-link" onClick={() => copyTestLinkToClipboard(test.wt_link)}>
                                            <BsCopy />
                                        </button>
                                    </td>
                                    <td>{test.wt_description}</td>
                                    <td>
                                        {test.TestWeekly?.length > 0 ? (
                                            <ul>
                                                {test.TestWeekly.map(weeklyTopic => (
                                                    <li key={weeklyTopic.id}>{weeklyTopic.TopicAssociation.name}</li>
                                                ))}
                                            </ul>
                                        ) : <span>No Topics Assigned</span>}
                                    </td>
                                    <td><Button onClick={() => handleEditClick(test)}>Edit</Button></td>
                                    <td><button onClick={() => handleBatches(test.wt_id)} className="btn btn-success">View Batch Details</button></td>
                                    <td><Link to={`/studentHome/weekly-test-results/${test.wt_id}`}>Results</Link></td>
                                    <td><Link to={`/add-questoin-weekly-test/${test.wt_id}`}>Add Question</Link></td>
                                    <td><Link to={`/fetch-questoins-weekly-test/${test.wt_id}`}>Edit Questions</Link></td>
                                    <td><Link to={`/upload-questoins-weekly-test/${test.wt_id}`}>Upload Questions</Link></td>
                                    <td><Link to={`/test-answer-form/${test.wt_id}`}>Provide Answer</Link></td>
                                         {/* Checkbox for Show Answers */}
                                <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={test.isAnswerDisplayed} // Correct property for checkbox status
                                    onChange={() => handleShowAnswerChange(test)} // Trigger toggle on change
                                    label={test.isAnswerDisplayed ? 'Show Answers' : 'Hide Answers'} // Dynamic label based on state
                                />
                                </td>
                                 <td>
                                <Form.Check
                                type="checkbox"
                                checked={test.isResultsVisible} // Correct property for checkbox status
                                onChange={() => handleShowResultChange(test)} // Trigger toggle on change
                                label={test.isResultsVisible ? 'Show Results' : 'Hide Results'} // Dynamic label based on state
                                />
                                    </td>
                                    <td>
                                        <button className="btn btn-danger ms-2 m-1" onClick={() => deassignTestLink(test.wt_id)}>
                                            <BsTrash />
                                        </button>
                                    </td>
                                </tr>
                            ) : null
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant="info" className="mt-4 text-center">No Weekly Tests Found</Alert>
            )}

            <Paginate
                currentPage={currentPage}
                totalItems={tests.length}
                itemsPerPage={testsPerPage}
                onPageChange={paginate}
            />

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
        </>
    );
};

export default InternalTestList;
