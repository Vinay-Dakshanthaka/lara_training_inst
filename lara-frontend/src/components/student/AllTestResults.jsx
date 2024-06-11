import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableRow, TableCell, TableHead, Typography, CircularProgress, Box, Button } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../config'; // Ensure this points to the correct configuration
import { useNavigate } from 'react-router-dom';

const AllTestResults = () => {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchTestResults = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token provided.");
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get(`${baseURL}/api/cumulative-test/getTestResultsByStudentId`, config);
                const sortedResults = response.data.sort((a, b) => new Date(b.completed_date_time) - new Date(a.completed_date_time));
                setTestResults(sortedResults);
            } catch (error) {
                console.error('Error fetching test results:', error);
            } finally {
                setLoading(false); // Update loading state after fetching
            }
        };

        fetchTestResults();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const navigate = useNavigate();

    const handleNavigate = (testResultId) => {
        navigate(`/all-test-results/${testResultId}`);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {loading && ( // Display preloader and dark backdrop while loading
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark backdrop
                    }}
                >
                    <CircularProgress color="primary" size={60} />
                </Box>
            )}
            <div style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Test Results
                </Typography>
                {testResults.length === 0 && !loading ? ( // Display appropriate message if no test results are available
                    <Typography variant="body1">No test results available.</Typography>
                ) : (
                    <Table style={{ width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Total Marks</strong></TableCell>
                                <TableCell><strong>Obtained Marks</strong></TableCell>
                                <TableCell><strong>View Details</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testResults.map((result) => (
                                <TableRow key={result.testResult_id}>
                                    <TableCell>{formatDate(result.completed_date_time)}</TableCell>
                                    <TableCell>{result.total_marks}</TableCell>
                                    <TableCell>{result.obtained_marks}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            style={{ marginTop: '20px' }}
                                            onClick={() => handleNavigate(result.testResult_id)} >View Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default AllTestResults;
