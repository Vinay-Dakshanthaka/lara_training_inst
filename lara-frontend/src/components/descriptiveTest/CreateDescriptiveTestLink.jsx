import { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../config';
import WhatsAppChannelDropdown from '../placementTest/WhatsAppChannelDropdown';

const CreateDescriptiveTestLink = () => {
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
    const [isMonitored, setIsMonitored] = useState(false); // State for isMonitored
    const [isIssueCertificate, setIsIssueCertificate] = useState(false); // State for provide certificate
    const [newTestLink, setNewTestLink] = useState(''); // New state for test link
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' }); // State for Bootstrap alerts
    const [testTitle, setTestTitle] = useState('');
    const [channelLink, setChannelLink] = useState('');
    const [certificateName, setCertificateName] = useState('');
    const [showModal, setShowModal] = useState(false);

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

    const handleChannelSelect = (link) => {
        setChannelLink(link);
    };

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
            if (error.response && error.response.status === 404) {
                setAlert({ show: true, message: 'No Topics Available for this Subject', variant: 'info' });
            } else {
                setAlert({ show: true, message: 'Something went wrong', variant: 'danger' });
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

            const response = await axios.post(
                `${baseURL}/api/placement-test/createDescriptiveTestLink`,
                {
                    number_of_questions: numQuestions,
                    description,
                    start_time: startTime,
                    end_time: endTime,
                    show_result: showResult,
                    topic_ids: selectedTopics,
                    is_Monitored: isMonitored, // Send isMonitored to the backend
                    test_title: testTitle,
                    channel_link: channelLink,
                    certificate_name: certificateName,
                    issue_certificate:isIssueCertificate
                },
                config
            );
            console.log(response.data,"---------------------------");
            // Set the test link in state
            setNewTestLink(response.data.newTest.test_link);
            setAlert({ show: true, message: 'Link Created Successfully', variant: 'success' });

            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error creating test link:', error);
            setAlert({ show: true, message: 'Something went wrong!!', variant: 'danger' });

            // Scroll to the top of the page for the error alert
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


    return (
        <div className="container mt-5">
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}

            {newTestLink && (
                <div className="mt-4 p-3 card" style={{ border: '1px solid #007bff', borderRadius: '5px', backgroundColor: '#e9ecef' }}>
                    <h5>Link Created Successfully:</h5>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#007bff' }}>{newTestLink}</p>
                    <p className="fw-bolder">
                        To add questions to this link,
                        <Link to="/test-links"> click here</Link>.
                    </p>
                </div>
            )}

            <h3 className="text-center">Create Test Link</h3>

            <Form.Group controlId="formSubject" className="mt-4" style={{ maxWidth: '400px' }}>
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
                        label="Select All Topics"
                        checked={selectAllTopics}
                        onChange={handleSelectAllTopics}
                    />
                    <div className="row mt-2">
                        {topics.map((topic) => (
                            <div className="col-md-3 col-sm-6 col-12" key={topic.topic_id}>
                                <Form.Check
                                    type="checkbox"
                                    label={`${topic.name} `}
                                    checked={selectedTopics.includes(topic.topic_id)}
                                    onChange={() => handleTopicChange(topic.topic_id)}
                                />
                            </div>
                        ))}
                    </div>
                </Form.Group>
            </div>

            <Form.Group controlId="formTestTitle" className="mt-4">
                <Form.Label>Test Title</Form.Label>
                <Form.Control
                    type="text"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="Enter test title"
                    required
                />
            </Form.Group>

            <Form.Group controlId="formCertificateName" className="mt-4">
                <Form.Label>Certificate Name</Form.Label>
                <Form.Control
                    type="text"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="Enter certificate name"
                    required
                />
            </Form.Group>

            <div className="row">
            <div className='col-auto'>
                <WhatsAppChannelDropdown onSelectChannel={handleChannelSelect} />
                <Link to='/add-whatsApp-link' className='btn btn-success my-3'>Add WhatsApp Channel</Link>
            </div>
            </div>


            <Form.Group controlId="formChannelLink" className="mt-4" >
                <Form.Label>WhatsApp Channel Link</Form.Label>
                <Form.Control
                    type="url"
                    value={channelLink}
                    onChange={(e) => setChannelLink(e.target.value)}
                    placeholder="The WhatsApp link will appear here"
                    required
                    disabled
                />
            </Form.Group>

            {/* <button className="btn btn-primary mt-3" onClick={() => setShowModal(true)}>
            Add WhatsApp Channel
        </button>
        {showModal && (
            <SaveWhatsAppChannelModal
                showModal={showModal}
                onClose={() => setShowModal(false)}
            />
        )} */}

            <Form.Group controlId="formNumQuestions" className="mt-4" style={{ maxWidth: '300px' }}>
                <Form.Label>Number of Questions</Form.Label>
                <Form.Control
                    type="number"
                    value={numQuestions}
                    onChange={handleNumQuestionsChange}
                    isInvalid={!!errorMessage}
                />
                <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-4">
                <Form.Label>Test Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="formStartTime" className="mt-4" style={{ maxWidth: '400px' }}>
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="formEndTime" className="mt-4" style={{ maxWidth: '400px' }}>
                <Form.Label>End Time</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="formShowResult" className="mt-4">
                <Form.Check
                    type="checkbox"
                    label="Show Results After Test"
                    checked={showResult}
                    onChange={() => setShowResult(!showResult)}
                />
            </Form.Group>

            <Form.Group controlId="formIsMonitored" className="mt-4">
                <Form.Check
                    type="checkbox"
                    label="Enable Monitoring"
                    checked={isMonitored}
                    onChange={() => setIsMonitored(!isMonitored)}
                />
            </Form.Group>
            <Form.Group controlId="formIssueCertificate" className="mt-4">
                <Form.Check
                    type="checkbox"
                    label="Provide Certificate "
                    checked={isIssueCertificate}
                    onChange={() => setIsIssueCertificate(!isIssueCertificate)}
                />
            </Form.Group>

            <Button className="btn btn-success mt-4 w-100" onClick={handleCreateLink}>
                Create Test Link
            </Button>
        </div>

    );
};

export default CreateDescriptiveTestLink;
