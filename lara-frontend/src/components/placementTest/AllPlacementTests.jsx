import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { Link } from 'react-router-dom';
import { BsCopy } from 'react-icons/bs';
import { OverlayTrigger, ToastContainer, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './allPlacementTest.css'

const AllPlacementTests = () => {
    const [placementTests, setPlacementTests] = useState([]);

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
    }, []);

    // Function to copy test link to clipboard
    const copyTestLinkToClipboard = (testLink) => {
        navigator.clipboard.writeText(testLink)
            .then(() => {
                toast.info('Test link copied to clipboard');
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
            });
    };

    // Function to activate link
    const activateLink = async (placement_test_id) => {
        try {
            await axios.post(`${baseURL}/api/placement-test/disable-link`, {
                test_id: placement_test_id,
                is_Active: true
            });
            toast.success('Link activated successfully');
            // Refresh the list of placement tests after activation
            const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
            const sortedTests = response.data.placementTests.sort((a, b) => b.is_Active - a.is_Active);
            setPlacementTests(sortedTests);
        } catch (error) {
            console.error('Error activating link:', error);
            toast.error('Failed to activate link');
        }
    };

    return (
        <div className="container mt-5">
            <h2>All Placement Tests</h2>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Test Link</th>
                            <th>Number of Questions</th>
                            {/* <th>Description</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Show Result</th> */}
                            <th>Results</th>
                            <th>Add Existing Questions</th>
                            <th>Add New Questions</th>
                            <th>Upload Questions</th>
                            <th>Activate Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {placementTests.map(test => (
                            <tr key={test.placement_test_id} className={test.is_Active ? 'table-success' : ''}>
                                <td>{test.placement_test_id}</td>
                                <td className="test-link-cell">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-${test.placement_test_id}`}>{test.test_link}</Tooltip>}
                                    >
                                        <span className="test-link-text">{test.test_link}</span>
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
                                <td>{test.number_of_questions}</td>
                                {/* <td>{test.description}</td>
                                <td>{test.start_time}</td>
                                <td>{test.end_time}</td>
                                <td>{test.show_result ? 'Yes' : 'No'}</td> */}
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
            <ToastContainer />
        </div>
    );
};

export default AllPlacementTests;
