import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../config';
import AllPlacementTests from './AllPlacementTests';
import { toast, ToastContainer } from 'react-toastify';

const CreateTestLink = () => {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [numQuestions, setNumQuestions] = useState(20);
    const [availableQuestions, setAvailableQuestions] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectAllTopics, setSelectAllTopics] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [showResult, setShowResult] = useState(true);
    const [newTestLink, setNewTestLink] = useState(''); // New state for test link
    const navigate = useNavigate();

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

            // Fetch question counts for these topics
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
            if(error.response && error.response.status === 404){
                toast.info('No Topics Available for this Subject')
            }else{
                toast.error('Something went wrong')
                console.error('Error fetching topics:', error);
            }
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
        setNumQuestions(value);
        if (value > availableQuestions) {
            setErrorMessage(`Enter less than ${availableQuestions}`);
        } else {
            setErrorMessage('');
        }
    };

    const handleCreateLink = async () => {
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

            const response = await axios.post(`${baseURL}/api/placement-test/create-test-link`, {
                number_of_questions: numQuestions,
                description,
                start_time: startTime,
                end_time: endTime,
                show_result: showResult,
                topic_ids: selectedTopics
            }, config);

            setNewTestLink(response.data.newTest.test_link); // Set the test link in state
            toast.success('Link Created');
        } catch (error) {
            console.error('Error creating test link:', error);
            toast.error('Something went wrong!!');
        }
    };


    return (
        <div className="container mt-5">
            {newTestLink && (
                <div className="mt-4 p-3 card " style={{ border: '1px solid #007bff', borderRadius: '5px', backgroundColor: '#e9ecef' }}>
                    <h5> Link Created Successfully :</h5>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#007bff' }}>
                        {/* <a href={newTestLink} target="_blank" rel="noopener noreferrer">{newTestLink}</a> */}
                        {newTestLink}
                    </p>
                    <p className="fw-bolder">
                   To add questions to this link
                   <Link to="/test-links">  click here</Link>
                   </p>
                </div>
            )}

            <h3 className="text-center">Create Test Link</h3>
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

            <Form.Group controlId="formNumQuestions" className="mt-4" style={{ maxWidth: '300px' }}>
                <Form.Label>Number of Questions</Form.Label>
                <Form.Control
                    type="number"
                    value={numQuestions}
                    onChange={handleNumQuestionsChange}
                    required
                />
                <p className="my-2" style={{width:'80vw'}}>
                    <span><sup className='text-danger h5'>*</sup></span>
                You can specify the number of questions for the test. If you add fewer questions than specified, only those will appear in the test. If you add more questions, random questions will be selected from the extras during the test, ensuring each student receives a unique set of questions.
                </p>
                {/* {errorMessage && (
                    <Form.Text className="text-danger">
                        {errorMessage}
                    </Form.Text>
                )} */}
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-4" style={{ maxWidth: '300px' }}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formStartTime" className="mt-4" style={{ maxWidth: '300px' }}>
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formEndTime" className="mt-4" style={{ maxWidth: '300px' }}>
                <Form.Label>End Time</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="formShowResult" className="mt-4">
                <Form.Check
                    type="checkbox"
                    label="Show Result"
                    checked={showResult}
                    onChange={() => setShowResult(!showResult)}
                />
            </Form.Group>

            <Button variant="primary" className="mt-4" onClick={handleCreateLink}>
                Create Test Link
            </Button>
            <ToastContainer />

            {/* Display the newly created test link */}
            {newTestLink && (
                <div className="mt-4">
                    <h5>Link Created successfully {newTestLink}</h5>
                   <p className="fw-bolder">
                   To add questions to this link
                   <Link to="/test-links">  click here</Link>
                   </p>
                    
                </div>
            )}

            {/* <AllPlacementTests /> */}
        </div>
    );
};

export default CreateTestLink;
