import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const AddQuestionToInternalTest = () => {
    const [topics, setTopics] = useState([]);
    const [internalTestDetails, setInternalTestDetails] = useState();
    const [selectedTopic, setSelectedTopic] = useState("");
    const [questionData, setQuestionData] = useState({
        question_description: "",
        no_of_marks_allocated: 1,
        difficulty_level: 1,
        options: ["", ""], // Initially two options
        correct_options: []
    });
    const { internal_test_id } = useParams();
    const navigate = useNavigate();  // Initialize useNavigate
    // Fetch internal test details
    const fetchInternalTestDetails = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/internal-test/getInternalTestById/${internal_test_id}`);
            console.log(response.data,"------------------datagetting")
            setInternalTestDetails(response.data.internalTest);
            setTopics(response.data.internalTest.topics);
            // Check testtype and navigate if true
            if (response.data.internalTest.testtype) {
                navigate('/add-question');  // Navigate to new component if testtype is true
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.info('No Internal Test details found');
            } else {
                toast.error('Something went wrong');
            }
        }
    };

    useEffect(() => {
        const fetchTopicsByInternalTest = async () => {
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
                    { placement_test_id: internal_test_id },
                    {
                        ...config,
                    }
                );

                if (response.data.topics) {
                    setTopics(response.data.topics);
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchTopicsByInternalTest();
        fetchInternalTestDetails();
    }, [internal_test_id]);

    const handleTopicChange = (e) => {
        setSelectedTopic(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuestionData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionData.options];
        newOptions[index] = value;
        setQuestionData((prevData) => ({
            ...prevData,
            options: newOptions
        }));
    };

    const addOptionField = () => {
        setQuestionData((prevData) => ({
            ...prevData,
            options: [...prevData.options, ""]
        }));
    };

    const handleCorrectOptionChange = (option, isChecked) => {
        const newCorrectOptions = isChecked
            ? [...questionData.correct_options, option]
            : questionData.correct_options.filter((item) => item !== option);

        setQuestionData((prevData) => ({
            ...prevData,
            correct_options: newCorrectOptions
        }));
    };

    const validateForm = () => {
        const { question_description, options, correct_options } = questionData;

        if (!selectedTopic) {
            toast.error("Please select a topic.");
            return false;
        }

        if (!question_description.trim()) {
            toast.error("Please enter a question description.");
            return false;
        }

        const filledOptions = options.filter(option => option.trim() !== "");

        if (filledOptions.length < 2) {
            toast.error("Please provide at least two options.");
            return false;
        }

        if (correct_options.length === 0) {
            toast.error("Please select at least one correct option.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
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

            // Filter out empty options before sending to backend
            const filteredOptions = questionData.options.filter(option => option.trim() !== "");

            const response = await axios.post(
                `${baseURL}/api/internal-test/saveQuestionAndAddToLinkTopic`,
                {
                    ...questionData,
                    options: filteredOptions,
                    topic_id: selectedTopic,
                    internal_test_id: internal_test_id
                },
                config
            );

            console.log("Question added successfully:", response.data);
            toast.success('Question added successfully!');

            // Reset the form fields
            setQuestionData({
                question_description: "",
                no_of_marks_allocated: 1,
                difficulty_level: 1,
                options: ["", ""],
                correct_options: []
            });
        } catch (error) {
            console.error("Error adding question:", error);
            toast.error("Error adding question. Please try again.");
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="container mt-3 card shadow">
                <h3 className="text-center py-4">Add Questions to Internal Test Link</h3>
                <Row>
                    <div className="container">
                    {/* {internalTestDetails && (
                        <div className="mb-3">
                            <h5>Test Link: <a href={internalTestDetails.test_link} target="_blank" rel="noopener noreferrer">{internalTestDetails.test_link}</a></h5>
                        </div>
                    )} */}
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
                    <Form onSubmit={handleSubmit} className="w-100">
                        <Row>
                            {/* <Col md={6} className="mb-3">
                                <h5>Subject Name: {topics.length > 0 ? topics[0].subject_name : "N/A"}</h5>
                            </Col> */}
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
                            <Form.Group controlId="marksAllocated" as={Col} md="6" className="mb-3">
                                <Form.Label>Number of Marks Allocated</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="no_of_marks_allocated"
                                    value={questionData.no_of_marks_allocated}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="difficultyLevel" as={Col} md="6" className="mb-3">
                                <Form.Label>Difficulty Level</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="difficulty_level"
                                    value={questionData.difficulty_level}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group controlId="questionDescription" as={Col} md="12" className="mb-3">
                                <Form.Label>Question Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="question_description"
                                    value={questionData.question_description}
                                    onChange={handleInputChange}
                                    required
                                    style={{ minHeight: '100px' }}
                                />
                            </Form.Group>
                        </Row>

                        <Row>
                            {questionData.options.map((option, index) => (
                                <Form.Group controlId={`option${index}`} as={Col} md="6" className="mb-3" key={index}>
                                    <Form.Label>{`Option ${index + 1}`}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                                </Form.Group>
                            ))}
                            <div className="text-center">
                                <Button variant="secondary" onClick={addOptionField} className="mb-3 col-6">
                                    Add one more option
                                </Button>
                            </div>
                        </Row>

                        <Row>
                            <Form.Group as={Col} md="12" className="mb-3">
                                <Form.Label>Correct Option(s)</Form.Label>
                                <div>
                                    {questionData.options.map((option, index) => (
                                        <Form.Check
                                            type="checkbox"
                                            name="correct_option"
                                            label={option || `Option ${index + 1}`}
                                            value={option}
                                            checked={questionData.correct_options.includes(option)}
                                            onChange={(e) => handleCorrectOptionChange(option, e.target.checked)}
                                            key={index}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Row>
                        <div className="text-center">
                            <Button variant="primary" type="submit" className="col-6">
                                Add Question
                            </Button>
                        </div>
                    </Form>
                </Row>
            </div>
        </>
    );
};

export default AddQuestionToInternalTest;
