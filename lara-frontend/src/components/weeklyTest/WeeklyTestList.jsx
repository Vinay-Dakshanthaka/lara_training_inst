// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table, Spinner, Alert, Button, Modal, OverlayTrigger, Tooltip, Pagination, Badge ,Form, ToastContainer} from 'react-bootstrap';
// import { baseURL } from '../config';  // Import your base URL
// import UpdateWeeklyTest from './UpdateWeeklyTest'; // Import the UpdateWeeklyTest component
// import { BsCopy } from 'react-icons/bs';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';
// import { BsTrash } from 'react-icons/bs';
// import { useNavigate } from 'react-router-dom';
// import Paginate from '../common/Paginate';


// const WeeklyTestList = () => {
//     const [tests, setTests] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [selectedTest, setSelectedTest] = useState(null);  // For selected test
//     const [showModal, setShowModal] = useState(false);  // For modal visibility
//     const [currentPage, setCurrentPage] = useState(1);
//     const [testsPerPage] = useState(5);  // Number of tests per page
//     const [showAnswerModal, setShowAnswerModal] = useState(false);
//     const [showAnswersStatus, setShowAnswersStatus] = useState(false); 
//     const navigate = useNavigate(); 
//     const [isAnswerDisplayed, setIsAnswerDisplayed] = useState(false);


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
//                 console.log(response.data,"--------------------------------data")
//                 const sortedTests = response.data.tests.sort((a, b) => b.wt_id - a.wt_id); // Sort by ID, latest first
//                 setTests(sortedTests);
//             } catch (err) {
//                 setError(err.response?.data?.message || err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchWeeklyTests();
//     }, []);


// const handleShowAnswersClick = (test) => {
//     setSelectedTest(test);
//     setShowAnswersStatus(test.show_answers || false);
//     setShowAnswerModal(true);
// };
//     // Pagination logic
//     const indexOfLastTest = currentPage * testsPerPage;
//     const indexOfFirstTest = indexOfLastTest - testsPerPage;
//     const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     // Update the test in the list after editing
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

//     const handleCloseAnswerModal = () => {
//         setShowAnswerModal(false);
//         setSelectedTest(null);
//     };


//     const handleCheckboxChange = () => {
//         // Toggle the checkbox state
//         setShowAnswersStatus(!showAnswersStatus);
//         // Update the isAnswerDisplayed state accordingly
//         setIsAnswerDisplayed(!isAnswerDisplayed);
//     };
    
//     const handleUpdateShowAnswersStatus = async () => {
//         if (!selectedTest) return;
    
//         try {
//             const response = await axios.put(`${baseURL}/api/weekly-test/updateShowAnswersStatus`, {
//                 wt_id: selectedTest.wt_id,
//                 isAnswerDisplayed: isAnswerDisplayed, // Send updated isAnswerDisplayed value
//             });
    
//             console.log(response.data, "---------------------------- showanswers");
    
//             // Handle different status codes with appropriate messages
//             if (response.status === 200) {
//                 toast.success("Show Answers status updated successfully!");
//                 alert("Show Answers status updated successfully!");
//                 updateTestInList({ ...selectedTest, show_answers: isAnswerDisplayed });
//                 handleCloseAnswerModal();
//             } else if (response.status === 403) {
//                 toast.info("Show Answers status is already up to date.");
//             } else if (response.status === 404) {
//                 toast.error("Test not found.");
//             } else {
//                 toast.error("Failed to update Show Answers status.");
//             }
//         } catch (error) {
//             console.error("Failed to update Show Answers status:", error);
    
//             // Handle different error statuses if available
//             if (error.response) {
//                 if (error.response.status === 400) {
//                     toast.error("Test ID is required.");
//                     alert("Test ID is required.")
//                 } else if (error.response.status === 404) {
//                     toast.error("Test not found.");
//                     alert("Test not found.");
//                 } else if (error.response.status === 500) {
//                     toast.error("Internal server error. Please try again later.");
//                     alert("Internal server error. Please try again later.");
//                 } else {
//                     toast.error(error.response.data.message || "Failed to update Show Answers status.");
//                     alert(error.response.data.message || "Failed to update Show Answers status.");
//                 }
//             } else {
//                 toast.error("Network error. Please check your connection.");
//                 alert("Network error. Please check your connection.");
//             }
//         }
//     };
    


//     if (loading) {
//         return <div className="text-center mt-5"><Spinner animation="border" /></div>;
//     }

//     if (error) {
//         return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
//     }

//     const copyTestLinkToClipboard = (testLink) => {
//         navigator.clipboard.writeText(testLink)
//             .then(() => {
//                 toast.info('Test link copied to clipboard');
//             })
//             .catch((error) => {
//                 console.error('Error copying to clipboard:', error);
//             });
//     };


//     const deassignTestLink = async (wt_id) => {
//         try {
//           const response = await axios.delete(`${baseURL}/api/weekly-test/deleteinternaltests/${wt_id}`);
    
//         //   console.log(response.data, "------------------------------response data");
//           toast.success(response.data.message);
//           alert("Test Link Deleted Succussfully...")
//         } catch (error) {
//           console.error('Error deleting internal test:', error);
//           alert("Error deleting internal test")
//           toast.error('An error occurred while deleting the test.');
//         }
//       };

//       const handleBatches = (wt_id) => {
//         // Navigate to the BatchDetails component with the internal_test_id as a URL parameter
//         navigate(`/batch-details-wt/${wt_id}`);
//       };

     
    
//     return (
//         <>
       
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
//                             <th>view Batchs</th>
//                             <th>Results</th>
//                             <th>Add Question</th>
//                             <th>Edit Question</th>
//                             <th>Upload Question</th>
//                             <th>Provide Answer</th>
//                             <th>isAnswerDisplayed</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentTests.map((test, index) => (
//                             test && test.wt_id ? (
//                                 <tr key={test.wt_id}>
//                                     <td>{index + 1}{index === 0 && <td><Badge variant="success">New</Badge></td>}</td>
//                                     <td className="test-link-cell">
//                                         <OverlayTrigger
//                                             placement="top"
//                                             overlay={<Tooltip id={`tooltip-${test.wt_id}`}>{test.wt_link}</Tooltip>}
//                                         >
//                                             <p className="test-link-text" style={{ width: 'fit-content', textWrap: 'wrap' }}>{test.wt_link}&nbsp;</p>
//                                         </OverlayTrigger>
//                                         <button
//                                             className="btn btn-link"
//                                             onClick={() => copyTestLinkToClipboard(test.wt_link)}
//                                         >
//                                             <BsCopy />
//                                         </button>
//                                     </td>
//                                     <td>{test.wt_description}</td>
//                                     <td>
//                                         {test.TestWeekly && test.TestWeekly.length > 0 ? (
//                                             <ul>
//                                                 {test.TestWeekly.map(weeklyTopic => (
//                                                     <li key={weeklyTopic.id}>
//                                                         {weeklyTopic.TopicAssociation.name}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         ) : (
//                                             <span>No Topics Assigned</span>
//                                         )}
//                                     </td>
//                                     <td>
//                                         <Button variant="primary" onClick={() => handleEditClick(test)}>
//                                             Edit
//                                         </Button>
//                                     </td>
//                                     <td>
//                                     <button
//                           onClick={() => handleBatches(test.wt_id)} 
//                           className="btn btn-success"
//                           >
//                           View Batch Details
//                           </button>

//                                     </td>
//                                     <td>
//                                         <Link to={`/studentHome/weekly-test-results/${test.wt_id}`}>Results</Link>
//                                     </td>
//                                     <td>
//                                         <Link to={`/add-questoin-weekly-test/${test.wt_id}`}>Add Question</Link>
//                                     </td>
//                                     <td>
//                                         <Link to={`/fetch-questoins-weekly-test/${test.wt_id}`}>Edit Questions</Link>
//                                     </td>
//                                     <td>
//                                         <Link to={`/upload-questoins-weekly-test/${test.wt_id}`}>Upload Questions</Link>
//                                     </td>
//                                     <td>
//                                         <Link to={`/test-answer-form/${test.wt_id}`}>Provide answer</Link>
//                                     </td>
//                                     <td>   <Button variant="success" onClick={() => handleShowAnswersClick(test)}>
//                                     Show Answers
//                                     </Button>
//                                     </td>
//                                      <td><button
//                                      className="btn btn-danger ms-2 m-1"
//                                      onClick={() => deassignTestLink(test.wt_id)}
//                                      >
//                                      <BsTrash />
//                                     </button></td>
                                    
//                                 </tr>
//                             ) : null
//                         ))}
//                     </tbody>
//                 </Table>
//             ) : (
//                 <Alert variant="info" className="mt-4 text-center">
//                     No Weekly Tests Found
//                 </Alert>
//             )}

//                     <Paginate
//                         currentPage={currentPage}
//                         totalItems={tests.length}
//                         itemsPerPage={testsPerPage}
//                         onPageChange={paginate}
//                     />

//             {/* Pagination */}
//             {/* <Pagination>
//                 {[...Array(Math.ceil(tests.length / testsPerPage)).keys()].map((num) => (
//                     <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => paginate(num + 1)}>
//                         {num + 1}
//                     </Pagination.Item>
//                 ))}
//             </Pagination> */}

// //             {/* Modal to edit selected weekly test */}
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

//    {/* Show Answers Modal */}
//    <Modal show={showAnswerModal} onHide={handleCloseAnswerModal}>
//    <Modal.Header closeButton>
//        <Modal.Title>Show Answers Visibility</Modal.Title>
//    </Modal.Header>
//    <Modal.Body>
//        <Form>
//            <Form.Check
//                type="checkbox"
//                label="Answers Visible to Students"
//                checked={showAnswersStatus}
//                onChange={handleCheckboxChange}
//            />
//        </Form>
//    </Modal.Body>
//    <Modal.Footer>
//        <Button variant="secondary" onClick={handleCloseAnswerModal}>
//            Cancel
//        </Button>
//        <Button variant="primary" onClick={handleUpdateShowAnswersStatus}>
//            Update
//        </Button>
//    </Modal.Footer>
// </Modal>

//          </div>
//         </>
//      );
     
//  };

//  export default WeeklyTestList;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button, Modal, OverlayTrigger, Tooltip, Pagination, Badge ,Form } from 'react-bootstrap';
import { baseURL } from '../config';  // Import your base URL
import UpdateWeeklyTest from './UpdateWeeklyTest'; // Import the UpdateWeeklyTest component
import { BsCopy } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify'; 
import { Link } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Paginate from '../common/Paginate';


const WeeklyTestList = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);  // For selected test
    const [showModal, setShowModal] = useState(false);  // For modal visibility
    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage] = useState(5);  // Number of tests per page
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
                // console.log(response.data,"--------------------------------data")
                // const sortedTests = response.data.tests.sort((a, b) => b.wt_id - a.wt_id); // Sort by ID, latest first
                // setTests(sortedTests);

                 // Filter tests with testType: false and sort by ID, latest first
            const filteredTests = response.data.tests
            .filter(test => test.testType === false)
            .sort((a, b) => b.wt_id - a.wt_id);

        setTests(filteredTests);

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


    const deassignTestLink = async (wt_id) => {
        try {
          const response = await axios.delete(`${baseURL}/api/weekly-test/deleteinternaltests/${wt_id}`);
    
        //   console.log(response.data, "------------------------------response data");
          toast.success(response.data.message);
          alert("Test Link Deleted Succussfully...")
        } catch (error) {
          console.error('Error deleting internal test:', error);
          alert("Error deleting internal test")
          toast.error('An error occurred while deleting the test.');
        }
      };

      const handleBatches = (wt_id) => {
        // Navigate to the BatchDetails component with the internal_test_id as a URL parameter
        navigate(`/batch-details-wt/${wt_id}`);
      };

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
                            <th>view Batchs</th>
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
                                    <button
                          onClick={() => handleBatches(test.wt_id)} 
                          className="btn btn-success"
                          >
                          View Batch Details
                          </button>

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

                                     <td><button
                                     className="btn btn-danger ms-2 m-1"
                                     onClick={() => deassignTestLink(test.wt_id)}
                                     >
                                     <BsTrash />
                  
                                    </button></td>
                                    
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
        </>
     );
     
 };

 export default WeeklyTestList;




