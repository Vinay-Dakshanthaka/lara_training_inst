import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Pagination, Container } from 'react-bootstrap';
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const AssignQuestionsToInternalTestLink = () => {
    const [internalTestDetails, setInternalTestDetails] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { internal_test_id } = useParams();

    const fetchInternalTestDetails = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/internal-test/getInternalTestById/${internal_test_id}`);
            setInternalTestDetails(response.data.internalTest);
            setTopics(response.data.internalTest.topics);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.info('No Internal Test details found');
            } else {
                toast.error('Something went wrong');
            }
        }
    };

    useEffect(() => {
        fetchInternalTestDetails();
    }, [internal_test_id]);

    const handleTopicChange = async (e) => {
        const topicId = e.target.value;
        setSelectedTopic(topicId);

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

            const response = await axios.post(
                `${baseURL}/api/placement-test/fetchQuestionsUsingTopicId`, // Update the endpoint as needed
                { topic_id: topicId },
                config
            );

            const fetchedQuestions = response.data.questions;
            setQuestions(fetchedQuestions);
            setTotalPages(Math.ceil(fetchedQuestions.length / ITEMS_PER_PAGE));
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.info('No Questions found for the selected Topic');
            } else {
                console.error("Error fetching questions:", error);
                toast.error(error.message);
            }
        }
    };

    const handleCheckboxChange = (questionId) => {
        const isSelected = selectedQuestions.includes(questionId);
        if (isSelected) {
            setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
        } else {
            setSelectedQuestions([...selectedQuestions, questionId]);
        }
    };

    const handleAddQuestions = async () => {
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

            const requestBody = {
                internal_test_id: internal_test_id,
                question_ids: selectedQuestions,
            };

            const response = await axios.post(
                `${baseURL}/api/internal-test/assignQuestionsToInternalTestLink`,
                requestBody,
                config
            );

            toast.success(response.data.message);
        } catch (error) {
            console.error("Error adding questions:", error);
            toast.error(error.message);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedQuestions = questions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <>
            <ToastContainer />
            <Container className="my-4">
                <div className="container">
                    {internalTestDetails && (
                        <div className="mb-3 row">
                            <div className="my-3 col-5">
                                <h5>Test Link: <a href={internalTestDetails.internal_test_link} target="_blank" rel="noopener noreferrer">{internalTestDetails.internal_test_link}</a></h5>
                            </div>
                            <div className="col-5">
                                <h5>Number of Questions: {internalTestDetails.number_of_questions}</h5>
                                <h5>Description: {internalTestDetails.test_description}</h5>
                            </div>
                        </div>
                    )}
                </div>
                <Row>
                    <Col md={6} className="mb-3">
                        <h5>Available Topics:</h5>
                        {topics.length > 0 ? (
                            <Form.Group controlId="topicSelect">
                                <Form.Label>Select Topic</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedTopic}
                                    onChange={handleTopicChange}
                                    required
                                    disabled={topics.length === 0}
                                >
                                    <option value="">-- Select Topic --</option>
                                    {topics.map((topic) => (
                                        <option key={topic.topic_id} value={topic.topic_id}>
                                            {topic.topic_name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        ) : (
                            <p>No topics available for this test.</p>
                        )}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h4>Available Questions:</h4>
                        {questions.length === 0 ? (
                            <p>No questions available for the selected topic.</p>
                        ) : (
                            <>
                                <ul>
                                    {paginatedQuestions.map((question) => (
                                        <li key={question.cumulative_question_id} style={{ listStyle: 'none' }} className='my-2 border p-2'>
                                            <Form.Check
                                                type="checkbox"
                                                id={`question-${question.cumulative_question_id}`}
                                                label={question.question_description}
                                                checked={selectedQuestions.includes(question.cumulative_question_id)}
                                                onChange={() => handleCheckboxChange(question.cumulative_question_id)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <Pagination>{renderPagination()}</Pagination>
                            </>
                        )}
                        <Button
                            variant="primary"
                            onClick={handleAddQuestions}
                            disabled={selectedQuestions.length === 0}
                        >
                            Add the selected Questions
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AssignQuestionsToInternalTestLink;
