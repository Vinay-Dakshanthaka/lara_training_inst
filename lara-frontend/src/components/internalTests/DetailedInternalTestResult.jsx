import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Container, ListGroup, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';

const DetailedInternalTestResult = () => {
    const { internal_test_id } = useParams();
    const [results, setResults] = useState([]);
    const [marksObtained, setMarksObtained] = useState(0);
    const [totalMarks, setTotalMarks] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestResults();
    }, [internal_test_id]);

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

            const response = await axios.get(`${baseURL}/api/internal-test/results/${internal_test_id}`, config);
            const { questions, marks_obtained, total_marks } = response.data; // Get the questions array and marks
            setResults(questions); // Set results to the questions array
            setMarksObtained(marks_obtained); // Set obtained marks
            setTotalMarks(total_marks); // Set total marks
        } catch (error) {
            console.error('Error fetching test results:', error);
            toast.error('Error fetching test results');
        } finally {
            setLoading(false);
        }
    };

    const renderOptions = (options, correctOptions, selectedOptions) => {
        return options.map(option => {
            const isCorrect = correctOptions.includes(option.option_description);
            const isSelected = selectedOptions.includes(option.option_description);
            let className = '';

            if (isCorrect && isSelected) {
                className = 'text-success'; // Correct answer selected
            } else if (isCorrect) {
                className = 'text-success'; // Correct answer
            } else if (isSelected) {
                className = 'text-danger'; // Wrong answer selected
            }

            return (
                <ListGroup.Item key={option.option_id} className={className}>
                    {option.option_description}
                </ListGroup.Item>
            );
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <h2>Detailed Internal Test Results</h2>
            <Row className="mb-4">
                <Col>
                    <h5>Marks Obtained: {marksObtained}</h5>
                </Col>
                <Col>
                    <h5>Total Marks: {totalMarks}</h5>
                </Col>
            </Row>
            <Table striped bordered hover responsive className="mt-4">
                <thead>
                    <tr>
                        <th>Question ID</th>
                        <th>Question</th>
                        <th>Correct Options</th>
                        <th>Selected Options</th>
                        <th>Available Options</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result) => (
                        <tr key={result.cumulative_question_id}>
                            <td>{result.cumulative_question_id}</td>
                            <td style={{maxWidth:'70vw'}}>
                                <pre>
                                {result.question_description}
                                </pre>
                            </td>
                            <td>
                                <pre>
                                {result.correct_options.join(', ')}
                                </pre>
                            </td>
                            <td>
                                <pre>
                                {result.selected_options.length > 0 
                                    ? result.selected_options.join(', ') 
                                    : 'Not Attempted'}
                                </pre>
                            </td>
                            <td>
                                <ListGroup>
                                    {renderOptions(result.options, result.correct_options, result.selected_options)}
                                </ListGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        </Container>
    );
};

export default DetailedInternalTestResult;
