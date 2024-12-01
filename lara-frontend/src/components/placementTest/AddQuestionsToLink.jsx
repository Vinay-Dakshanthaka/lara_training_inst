import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Pagination, Container } from 'react-bootstrap';
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const AddQuestionsToLink = () => {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [placementTestDetails, setPlacementTestDetails] = useState();
    const { test_id } = useParams();

    const fetchPlacementTestDetails = async () => {
        try {
            const response = await axios.post(
                `${baseURL}/api/placement-test/getPlacementTestById`,
                { placement_test_id: test_id },
            );
            setPlacementTestDetails(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.info('No Test details found')
            } else {
                toast.error('Something went wrong')
            }
        }
    }

    useEffect(() => {
        const fetchTopicsByPlacementTestId = async () => {
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
                    `${baseURL}/api/placement-test/getTopicsByPlacementTestId`,
                    { placement_test_id: test_id },
                    config
                );

                if (response.data.topics) {
                    setTopics(response.data.topics);
                } else {
                    toast.error("No topics found for this placement test.");
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
                toast.error(error.message);
            }
        };

        fetchTopicsByPlacementTestId();
        fetchPlacementTestDetails();
    }, [test_id]);

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
                `${baseURL}/api/placement-test/fetchQuestionsUsingTopicId`,
                { topic_id: topicId },
                config
            );

            const fetchedQuestions = response.data.questions;
            setQuestions(fetchedQuestions);
            setTotalPages(Math.ceil(fetchedQuestions.length / ITEMS_PER_PAGE));
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.info('No Questions found for the selected Topic')
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
                placement_test_id: test_id,
                question_ids: selectedQuestions,
            };

            const response = await axios.post(
                `${baseURL}/api/placement-test/assignQuestionsToPlacementTest`,
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

    const handleSelectAll = () => {
        setSelectedQuestions(questions.map(question => question.cumulative_question_id));
    };

    const handleSelectRandomQuestions = () => {
        const randomQuestions = [...questions];
        if (randomQuestions.length > 45) {
            const shuffled = randomQuestions.sort(() => 0.5 - Math.random());
            setSelectedQuestions(shuffled.slice(0, 45).map(question => question.cumulative_question_id));
        } else {
            setSelectedQuestions(randomQuestions.map(question => question.cumulative_question_id));
        }
    };

    const paginatedQuestions = questions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderPagination = () => {
        let items = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let number = startPage; number <= endPage; number++) {
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
                    {placementTestDetails && (
                        <div className="mb-3 row">
                            <div className="my-3 col-5">
                                <h5>Test Link: <a href={placementTestDetails.test_link} target="_blank" rel="noopener noreferrer">{placementTestDetails.test_link}</a></h5>
                            </div>
                            <Link to={`/add-new-questions/${placementTestDetails.placement_test_id}`} className='col-5'>
                                <span className='btn btn-outline-primary'>Add New Questions for this test link</span>
                            </Link>
                        </div>
                    )}
                </div>
                <Row>
                    <Col md={6} className="mb-3">
                        <h5>Subject: {topics.length > 0 ? topics[0].subject_name : "N/A"}</h5>
                    </Col>



                    <Col md={6} className="mb-3">
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
                    </Col>
                </Row>

                <Row>
                    <Col><Button
                        variant="primary"
                        onClick={handleSelectAll}
                        className="mr-2"
                    >
                        Select All
                    </Button></Col>
                    <Col>
                        <Button
                            variant="secondary"
                            onClick={handleSelectRandomQuestions}
                            className="mr-2"
                        >
                            Select Random 45 Questions
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="primary"
                            onClick={handleAddQuestions}
                            disabled={selectedQuestions.length === 0}
                        >
                            Add the selected Questions
                        </Button>
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
                                <div className="d-flex justify-content-center my-4">
                                    <Pagination>{renderPagination()}</Pagination>
                                </div>
                            </>
                        )}

                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AddQuestionsToLink;
