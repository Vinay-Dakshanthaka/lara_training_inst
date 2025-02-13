import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Importing Toastify for notifications
import { baseURL } from '../config';
import BackButton from '../BackButton';
import WeeklyTestDetails from './WeeklyTestDetails';

const AddWeeklyTestQuestion = () => {
    const { wt_id } = useParams(); // Get wt_id from URL params
    const [questionData, setQuestionData] = useState({
        wt_question_description: '',
        marks: '',
        minutes: '',
    });
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [availableTopics, setAvailableTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [wtLink, setWtLink] = useState(''); // State to store the weekly test link

    // Fetch weekly test details by ID
    useEffect(() => {
        const fetchWeeklyTestDetails = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token provided.");

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                const response = await axios.get(`${baseURL}/api/weekly-test/getWeeklyTestById/${wt_id}`, config);
                const test = response.data.test;

                // Set available topics from the fetched test
                const topics = test.TestWeekly.map(topic => ({
                    topic_id: topic.TopicAssociation.topic_id,
                    name: topic.TopicAssociation.name
                }));

                setAvailableTopics(topics);
                setWtLink(test.wt_link); // Set the weekly test link

                if (topics.length > 0) {
                    setSelectedTopics([topics[0].topic_id]); // Select first topic by default if available
                }
            } catch (error) {
                setError(error.response?.data.message || 'Error fetching weekly test details');
                toast.error(error.response?.data.message || 'Error fetching weekly test details'); // Display error toast
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklyTestDetails();
    }, [wt_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuestionData((prev) => ({ ...prev, [name]: value }));

        // If marks are updated, set minutes to the same value initially
        if (name === 'marks') {
            setQuestionData((prev) => ({ ...prev, minutes: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token provided.");

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const data = {
                questionData: { ...questionData, topic_id: selectedTopics[0] }, // Send the selected topic ID
                wt_id,
            };

            await axios.post(`${baseURL}/api/weekly-test/saveQuestionHandler`, data, config);
            toast.success('Question saved successfully'); // Display success toast
            setQuestionData({
                wt_question_description: '',
                marks: '',
                minutes: '',
            });

            console.log(data,"-----------------------------")
            setSelectedTopics([]);
        } catch (error) {
            setError(error.response?.data.message || 'Error saving question');
            toast.error(error.response?.data.message || 'Error saving question'); // Display error toast
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-3">
            <BackButton />
            <WeeklyTestDetails />
            <ToastContainer />
            <h3>Add New Question</h3>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Display the weekly test link */}
            {/* {wtLink && (
                <div className="mt-3">
                    <strong>Weekly Test Link:</strong> <a href={wtLink} target="_blank" rel="noopener noreferrer">{wtLink}</a>
                </div>
            )} */}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTopic" className="mt-4">
                    <Form.Label>Select Topic</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedTopics[0] || ''}
                        onChange={(e) => setSelectedTopics([e.target.value])} // Only allow single topic selection
                        required
                    >
                        <option value="">-- Select Topic --</option>
                        {availableTopics.map((topic) => (
                            <option key={topic.topic_id} value={topic.topic_id}>
                                {topic.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formDescription" className="mt-4">
                    <Form.Label>Question Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="wt_question_description"
                        value={questionData.wt_question_description}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formDescription" className="mt-4">
                    <Form.Label>Question Keywords</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="wt_question_keywords"
                        value={questionData.wt_question_keywords}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <div className="d-flex justify-content-between">
                    <Form.Group controlId="formMarks" className="mt-4 col-5">
                        <Form.Label>Marks</Form.Label>
                        <Form.Control
                            type="number"
                            name="marks"
                            value={questionData.marks}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formMinutes" className="mt-4 col-5">
                        <Form.Label>Minutes</Form.Label>
                        <Form.Control
                            type="number"
                            name="minutes"
                            value={questionData.minutes}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                </div>

                <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Save Question'}
                </Button>
            </Form>
        </div>
    );
};

export default AddWeeklyTestQuestion;
