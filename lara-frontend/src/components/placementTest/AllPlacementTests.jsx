// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { baseURL } from '../config';
// import { Link } from 'react-router-dom';
// import { BsCopy, BsPencil } from 'react-icons/bs';
// import { OverlayTrigger, Tooltip, Badge, Modal, Button, Form, Pagination, Table } from 'react-bootstrap';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './allPlacementTest.css';

// const AllPlacementTests = () => {
//     const [placementTests, setPlacementTests] = useState([]);
//     const [selectedTest, setSelectedTest] = useState(null);
//     const [newQuestionCount, setNewQuestionCount] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1); // Track the current page, starting from 1
//     const [testsPerPage] = useState(10); // Number of tests to display per page

//     useEffect(() => {
//         const fetchPlacementTests = async () => {
//             try {
//                 const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
//                 const sortedTests = response.data.placementTests.sort((a, b) => b.is_Active - a.is_Active);
//                 setPlacementTests(sortedTests);
//             } catch (error) {
//                 console.error('Error fetching placement tests:', error);
//             }
//         };

//         fetchPlacementTests();

//         return () => {
//             toast.dismiss();
//         };
//     }, []);

//     const copyTestLinkToClipboard = (testLink) => {
//         navigator.clipboard.writeText(testLink)
//             .then(() => {
//                 toast.info('Test link copied to clipboard');
//             })
//             .catch((error) => {
//                 console.error('Error copying to clipboard:', error);
//             });
//     };

//     const activateLink = async (placement_test_id) => {
//         try {
//             await axios.post(`${baseURL}/api/placement-test/disable-link`, {
//                 test_id: placement_test_id,
//                 is_Active: true
//             });
//             toast.success('Link activated successfully');
//             const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
//             const sortedTests = response.data.placementTests.sort((a, b) => b.is_Active - a.is_Active);
//             setPlacementTests(sortedTests);
//         } catch (error) {
//             console.error('Error activating link:', error);
//             toast.error('Failed to activate link');
//         }
//     };

//     const handleEditClick = (test) => {
//         setSelectedTest(test);
//         setNewQuestionCount(test.number_of_questions);
//         setShowModal(true);
//     };

//     const handleSaveQuestions = async () => {
//         try {
//             await axios.post(`${baseURL}/api/placement-test/updateNumberOfQuestions`, {
//                 test_id: selectedTest.placement_test_id,
//                 number_of_questions: newQuestionCount
//             });
//             toast.success('Number of questions updated successfully');
//             setShowModal(false);
//             const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
//             setPlacementTests(response.data.placementTests);
//         } catch (error) {
//             console.error('Error updating number of questions:', error);
//             toast.error('Failed to update number of questions');
//         }
//     };

//     const handleMonitoredChange = async (test) => {
//         try {
//             const updatedStatus = !test.is_Monitored;
//             await axios.post(`${baseURL}/api/placement-test/updateIsMonitored`, {
//                 test_id: test.placement_test_id,
//                 is_Monitored: updatedStatus
//             });
//             const updatedTests = placementTests.map(t =>
//                 t.placement_test_id === test.placement_test_id ? { ...t, is_Monitored: updatedStatus } : t
//             );
//             setPlacementTests(updatedTests);
//             if (updatedStatus) {
//                 alert('Camera monitoring for this test is turned on');
//             }
//         } catch (error) {
//             console.error('Error updating monitored status:', error);
//             toast.error('Failed to update monitored status');
//         }
//     };

//     // Pagination logic
//     const totalPages = Math.ceil(placementTests.length / testsPerPage);
//     const indexOfLastTest = currentPage * testsPerPage;
//     const indexOfFirstTest = indexOfLastTest - testsPerPage;
//     const currentTests = placementTests.slice(indexOfFirstTest, indexOfLastTest);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     const renderPaginationItems = () => {
//         let items = [];
//         for (let number = 1; number <= totalPages; number++) {
//             items.push(
//                 <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
//                     {number}
//                 </Pagination.Item>
//             );
//         }
//         return items;
//     };

//     return (
//         <div className="container mt-5">
//             <ToastContainer />
//             <h2>All Placement Tests</h2>
//             <div className="table-responsive">
//                 <Table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th style={{ width: 'fit-content' }}>Test Link</th>
//                             <th>Number of Questions</th>
//                             <th>Camera Monitoring</th>
//                             <th>Results</th>
//                             <th>Add Existing Questions</th>
//                             <th>Add New Questions</th>
//                             <th>Upload Questions</th>
//                             <th>Edit Questions</th>
//                             <th>Activate Link</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentTests.map(test => (
//                             <tr key={test.placement_test_id} className={test.is_Active ? 'table-success animate-to-top' : ''}>
//                                 <td>{test.placement_test_id} {test.placement_test_id === Math.max(...placementTests.map(t => t.placement_test_id)) && <Badge bg="info">New</Badge>}</td>
//                                 <td className="test-link-cell">
//                                     <OverlayTrigger
//                                         placement="top"
//                                         overlay={<Tooltip id={`tooltip-${test.placement_test_id}`}>{test.test_link}</Tooltip>}
//                                     >
//                                         <p className="test-link-text" style={{ width: 'fit-content', textWrap: 'wrap' }}>{test.test_link}&nbsp;</p>
//                                     </OverlayTrigger>
//                                     {test.is_Active && (
//                                         <button
//                                             className="btn btn-link"
//                                             onClick={() => copyTestLinkToClipboard(test.test_link)}
//                                         >
//                                             <BsCopy />
//                                         </button>
//                                     )}
//                                 </td>
//                                 <td>
//                                     {test.number_of_questions}
//                                     <button className='btn btn-outline-secondary m-1'>
//                                         <BsPencil onClick={() => handleEditClick(test)} />
//                                     </button>
//                                 </td>
//                                 <td>
//                                     <Form.Check
//                                         type="checkbox"
//                                         checked={test.is_Monitored}
//                                         onChange={() => handleMonitoredChange(test)}
//                                     />
//                                 </td>
//                                 <td>
//                                     <Link to={`/get-result/${test.placement_test_id}`}>
//                                         Results
//                                     </Link>
//                                 </td>
//                                 <td>
//                                     <Link to={`/add-questions-tolink/${test.placement_test_id}`}>
//                                         Add Existing Questions
//                                     </Link>
//                                 </td>
//                                 <td>
//                                     <Link to={`/add-new-questions/${test.placement_test_id}`}>
//                                         Add New Questions
//                                     </Link>
//                                 </td>
//                                 <td>
//                                     <Link to={`/upload-excel-link/${test.placement_test_id}`}>
//                                         Upload Questions
//                                     </Link>
//                                 </td>
//                                 <td>
//                                     <Link to={`/edit-quesitons/${test.placement_test_id}`}>
//                                         Edit Questions
//                                     </Link>
//                                 </td>
//                                 <td>
//                                     {!test.is_Active && (
//                                         <button
//                                             className="btn btn-primary"
//                                             onClick={() => activateLink(test.placement_test_id)}
//                                         >
//                                             Activate
//                                         </button>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             </div>

//             {/* Bootstrap Pagination */}
//             <Pagination className="justify-content-center">
//                 {renderPaginationItems()}
//             </Pagination>

//             <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Update Number of Questions</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form.Group>
//                         <Form.Label>Number of Questions</Form.Label>
//                         <Form.Control
//                             type="number"
//                             value={newQuestionCount}
//                             onChange={(e) => setNewQuestionCount(e.target.value)}
//                         />
//                     </Form.Group>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Cancel
//                     </Button>
//                     <Button variant="primary" onClick={handleSaveQuestions}>
//                         Save Changes
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };
// export default AllPlacementTests;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { Link } from 'react-router-dom';
import { BsCopy, BsPencil } from 'react-icons/bs';
import { OverlayTrigger, Tooltip, Badge, Modal, Button, Form, Pagination, Table, Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './allPlacementTest.css';
import UpdatePlacementTestModal from './UpdatePlacementTestModal';

const AllPlacementTests = () => {
    const [placementTests, setPlacementTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [newQuestionCount, setNewQuestionCount] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page, starting from 1
    const [testsPerPage] = useState(10); // Number of tests to display per page

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState(null);

    const handleOpenModal = (testId) => {
        setSelectedTestId(testId); // Set the selected test ID
        setShowUpdateModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false); // Close the modal
        setSelectedTestId(null); // Reset the selected ID
    };

    const [alert, setAlert] = useState({
        show: false,
        message: '',
        variant: '', // 'success' or 'danger'
    });


    useEffect(() => {
        const fetchPlacementTests = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
                console.log(response, "-----------------------------------responseof fecthpalcemnsttests");

                // Sort first by is_Active (active tests first), then by placement_test_id in descending order
                const sortedTests = response.data.placementTests.sort((a, b) => {
                    if (b.is_Active === a.is_Active) {
                        return b.placement_test_id - a.placement_test_id; // If both have same active status, sort by test ID
                    }
                    return b.is_Active - a.is_Active; // Active tests will be sorted first
                });

                setPlacementTests(sortedTests);
                console.log("placement test details : ", sortedTests)
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


    // const activateLink = async (placement_test_id) => {
    //     console.log(placement_test_id, "--------------------------placement_test_id");
    //     try {
    //         await axios.post(`${baseURL}/api/placement-test/disable-link`, {
    //             test_id: placement_test_id,
    //             is_Active: true
    //         });
    //         toast.success('Link activated successfully');
    //         const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
    //         // console.log(response,"-------------------------------------------");
    //         const sortedTests = response.data.placementTests.sort((a, b) => b.is_Active - a.is_Active);
    //         setPlacementTests(sortedTests);
    //     } catch (error) {
    //         console.error('Error activating link:', error);
    //         toast.error('Failed to activate link');
    //     }
    // };

    const toggleLinkStatus = async (placement_test_id, currentStatus) => {
        try {
            // Toggle is_Active status
            const newStatus = !currentStatus;

            await axios.post(`${baseURL}/api/placement-test/disable-link`, {
                test_id: placement_test_id,
                is_Active: newStatus,
            });

            // toast.success(`Link ${newStatus ? 'activated' : 'deactivated'} successfully`);
            setAlert({
                show: true,
                message: `Link ${newStatus ? 'activated' : 'deactivated'} successfully`,
                variant: 'success',
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });

            const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
            // console.log(response, "-----------------------------------responseof fecthpalcemnsttests");

            // Sort first by is_Active (active tests first), then by placement_test_id in descending order
            const sortedTests = response.data.placementTests.sort((a, b) => {
                if (b.is_Active === a.is_Active) {
                    return b.placement_test_id - a.placement_test_id; // If both have same active status, sort by test ID
                }
                return b.is_Active - a.is_Active; // Active tests will be sorted first
            });
            setPlacementTests(sortedTests);
        } catch (error) {
            console.error('Error toggling link status:', error);
            // toast.error('Failed to update link status');
            setAlert({
                show: true,
                message: 'Failed to update link status',
                variant: 'danger',
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


    const handleEditClick = (test) => {
        console.log(test, "-------------------")
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

    // Pagination logic
    // Pagination logic
    const totalPages = Math.ceil(placementTests.length / testsPerPage);
    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = placementTests.slice(indexOfFirstTest, indexOfLastTest);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Render pagination items with ellipsis for large number of pages
    const renderPaginationItems = () => {
        let items = [];
        const maxVisiblePages = 5; // Maximum visible pages before adding ellipsis

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are less than maxVisiblePages
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            // Show the first page
            items.push(
                <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );

            // Show ellipsis if the current page is far from the first page
            if (currentPage > 3) {
                items.push(<Pagination.Ellipsis key="left-ellipsis" />);
            }

            // Show a range of pages around the current page
            const pageRange = [currentPage - 1, currentPage, currentPage + 1].filter(
                (page) => page >= 2 && page <= totalPages - 1
            );
            pageRange.forEach((page) => {
                items.push(
                    <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                        {page}
                    </Pagination.Item>
                );
            });

            // Show ellipsis if the current page is far from the last page
            if (currentPage < totalPages - 2) {
                items.push(<Pagination.Ellipsis key="right-ellipsis" />);
            }

            // Show the last page
            items.push(
                <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }
        return items;
    };



    return (
        <div className="container mt-5">
            <ToastContainer autoClose />
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <h2>All Placement Tests</h2>
            <div className="table-responsive">
                <Table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th style={{ width: 'fit-content' }}>Test Link</th>
                            <th>Number of Questions</th>
                            <th>Camera Monitoring</th>
                            <th>Update Details</th>
                            <th>Results</th>
                            <th>Add Existing Questions</th>
                            <th>Add New Questions</th>
                            <th>Upload Questions</th>
                            <th>Edit Questions</th>
                            <th>Activate Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTests.map(test => (
                            <tr key={test.placement_test_id} className={test.is_Active ? 'table-success animate-to-top' : ''}>
                                <td>
                                    {test.placement_test_id}
                                    {test.placement_test_id === Math.max(...placementTests.map(t => t.placement_test_id)) && <Badge bg="info">New</Badge>}
                                </td>
                                <td className="test-link-cell">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-${test.placement_test_id}`}>{test.test_link}</Tooltip>}
                                    >
                                        <p className="test-link-text" style={{ width: 'fit-content', textWrap: 'wrap' }}>{test.test_title}&nbsp;</p>
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
                                    <button className='btn btn-outline-secondary m-1'>
                                        <BsPencil onClick={() => handleEditClick(test)} />
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
                                    <button
                                        onClick={() => handleOpenModal(test.placement_test_id)}
                                        className="btn btn-primary"
                                    >
                                        Update details
                                    </button>
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
                                    <button
                                        className={`btn ${test.is_Active ? 'btn-success' : 'btn-danger'}`}
                                        onClick={() => toggleLinkStatus(test.placement_test_id, test.is_Active)}
                                    >
                                        {test.is_Active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </Table>
            </div>
            <UpdatePlacementTestModal
                placement_test_id={selectedTestId}
                show={showUpdateModal}
                handleClose={handleCloseModal}
            />

            {/* Bootstrap Pagination */}
            <Pagination className="justify-content-center" style={{ overflowX: 'auto' }}>
                <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                />
                {renderPaginationItems()}
                <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                />
            </Pagination>


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