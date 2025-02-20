import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { baseURL } from '../config';
import { Link } from 'react-router-dom';

const InternalTestLinkForm = () => {
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectAllTopics, setSelectAllTopics] = useState(false);
    const [availableQuestions, setAvailableQuestions] = useState(0);
    const [testDescription, setTestDescription] = useState('');
    const [showResult, setShowResult] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [isMonitored, setIsMonitored] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newTestLink, setNewTestLink] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    // State variables for date and time
    const [dateAndTime, setDateAndTime] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
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

                const response = await axios.get(`${baseURL}/api/cumulative-test/getAllSubjects`, config);
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleSubjectChange = async (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);
        setSelectedTopics([]);
        setAvailableQuestions(0);
        setErrorMessage('');

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

            const response = await axios.get(`${baseURL}/api/cumulative-test/getTopicsBySubjectId`, {
                params: { subject_id: subjectId },
                ...config,
            });

            const topics = response.data;

            const topicIds = topics.map(topic => topic.topic_id);
            const questionCountsResponse = await axios.post(`${baseURL}/api/cumulative-test/getQuestionCountsByTopicIds`, {
                topic_ids: topicIds
            }, config);

            const topicsWithCounts = topics.map(topic => {
                const countData = questionCountsResponse.data.find(item => item.topic_id === topic.topic_id);
                return {
                    ...topic,
                    question_count: countData ? countData.question_count : 0
                };
            });

            setTopics(topicsWithCounts);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleTopicChange = (topicId) => {
        setSelectedTopics((prevSelectedTopics) => {
            const newSelectedTopics = prevSelectedTopics.includes(topicId)
                ? prevSelectedTopics.filter((id) => id !== topicId)
                : [...prevSelectedTopics, topicId];

            updateAvailableQuestions(newSelectedTopics);
            return newSelectedTopics;
        });
    };

    const handleSelectAllTopics = () => {
        setSelectAllTopics(!selectAllTopics);
        if (!selectAllTopics) {
            const allTopicIds = topics.map(topic => topic.topic_id);
            setSelectedTopics(allTopicIds);
            updateAvailableQuestions(allTopicIds);
        } else {
            setSelectedTopics([]);
            setAvailableQuestions(0);
        }
    };

    const updateAvailableQuestions = async (topicIds) => {
        if (topicIds.length === 0) {
            setAvailableQuestions(0);
            return;
        }

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

            const response = await axios.post(`${baseURL}/api/cumulative-test/getQuestionCountsByTopicIds`, {
                topic_ids: topicIds
            }, config);

            const totalAvailableQuestions = response.data.reduce((sum, topic) => sum + topic.question_count, 0);
            setAvailableQuestions(totalAvailableQuestions);
        } catch (error) {
            console.error('Error fetching available questions:', error);
        }
    };

    const handleNumQuestionsChange = (e) => {
        const value = e.target.value;
        setNumberOfQuestions(value);
        if (value > availableQuestions) {
            setErrorMessage(`Enter less than ${availableQuestions}`);
        } else {
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            number_of_questions: numberOfQuestions,
            topic_ids: selectedTopics,
            test_description: testDescription,
            show_result: showResult,
            is_active: isActive,
            is_monitored: isMonitored,
            test_date: dateAndTime // Include date and time in the data
        };

        try {
            const response = await axios.post(`${baseURL}/api/internal-test/createInternalTestLink`, data);
            toast.success(response.data.message);
            setNewTestLink(response.data.newTest.test_link);
            setAlert({ show: true, message: 'Link Created Successfully', variant: 'success' });
        } catch (error) {
            toast.error('Error creating internal test. ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mt-5 responsive">
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}

            {newTestLink && (
                <div className="mt-4 p-3 card " style={{ border: '1px solid #007bff', borderRadius: '5px', backgroundColor: '#e9ecef' }}>
                    <h5> Link Created Successfully :</h5>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#007bff' }}>
                        {newTestLink}
                    </p>
                    <p className="fw-bolder">
                        To add questions to this link
                        <Link to="/test-links"> click here</Link>
                    </p>
                </div>
            )}
            <h2>Create Internal Test</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formSubject" className="mt-4" style={{ maxWidth: '300px' }}>
                    <Form.Label>Select Subject</Form.Label>
                    <Form.Control as="select" value={selectedSubject} onChange={handleSubjectChange} required>
                        <option value="">-- Select Subject --</option>
                        {subjects.map((subject) => (
                            <option key={subject.subject_id} value={subject.subject_id}>
                                {subject.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <div className="mt-4">
                    <h5>Select Topics</h5>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="Select All"
                            checked={selectAllTopics}
                            onChange={handleSelectAllTopics}
                        />
                        <div className="row mt-2">
                            {topics.map((topic) => (
                                <div className="col-3" key={topic.topic_id}>
                                    <Form.Check
                                        type="checkbox"
                                        label={`${topic.name} (${topic.question_count} questions)`}
                                        checked={selectedTopics.includes(topic.topic_id)}
                                        onChange={() => handleTopicChange(topic.topic_id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </Form.Group>
                </div>

                <Form.Group controlId="numberOfQuestions" className="mt-3">
                    <Form.Label>Number of Questions</Form.Label>
                    <Form.Control
                        type="number"
                        value={numberOfQuestions}
                        onChange={handleNumQuestionsChange}
                        required
                        placeholder="Enter number of questions"
                    />
                    {errorMessage && <p className="text-danger mt-1">{errorMessage}</p>}
                </Form.Group>

                <Form.Group controlId="testDescription" className="mt-3">
                    <Form.Label>Test Description</Form.Label>
                    <Form.Control
                        type="text"
                        value={testDescription}
                        onChange={(e) => setTestDescription(e.target.value)}
                        required
                        placeholder="Enter test description"
                    />
                </Form.Group>

                <Form.Group controlId="dateAndTime" className="mt-3">
                    <Form.Label>Date and Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={dateAndTime}
                        onChange={(e) => setDateAndTime(e.target.value)}
                        required
                    />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Form.Group controlId="showResult" className="form-check">
                            <Form.Check
                                type="checkbox"
                                label="Show Result"
                                checked={showResult}
                                onChange={(e) => setShowResult(e.target.checked)}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="isActive" className="form-check">
                            <Form.Check
                                type="checkbox"
                                label="Is Active"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="isMonitored" className="form-check">
                            <Form.Check
                                type="checkbox"
                                label="Is Monitored"
                                checked={isMonitored}
                                onChange={(e) => setIsMonitored(e.target.checked)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="mt-4">
                    Create Internal Test
                </Button>
            </Form>
        </div>
    );
};

export default InternalTestLinkForm;
