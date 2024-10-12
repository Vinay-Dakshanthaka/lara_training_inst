import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Spinner, Alert } from 'react-bootstrap';
import { baseURL } from '../config';  // Import your base URL

const SubjectTopicSelector = ({ onSubjectChange, onTopicChange, selectedTopics, setSelectedTopics }) => {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectAllTopics, setSelectAllTopics] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token provided.");

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                const response = await axios.get(`${baseURL}/api/cumulative-test/getAllSubjects`, config);
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
                setError('Error fetching subjects');
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const handleSubjectChange = async (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);
        setSelectedTopics([]);
        setSelectAllTopics(false);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token provided.");

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const response = await axios.get(`${baseURL}/api/cumulative-test/getTopicsBySubjectId`, {
                params: { subject_id: subjectId },
                ...config,
            });

            setTopics(response.data);
            onSubjectChange(subjectId);  // Notify parent about subject change
        } catch (error) {
            console.error('Error fetching topics:', error);
            setError('Error fetching topics');
        }
    };

    const handleTopicChange = (topicId) => {
        const updatedTopics = selectedTopics.includes(topicId)
            ? selectedTopics.filter(id => id !== topicId)
            : [...selectedTopics, topicId];
        setSelectedTopics(updatedTopics);
        onTopicChange(updatedTopics);  // Notify parent about topic change
    };

    const handleSelectAllTopics = (e) => {
        setSelectAllTopics(e.target.checked);
        const updatedTopics = e.target.checked ? topics.map(topic => topic.topic_id) : [];
        setSelectedTopics(updatedTopics);
        onTopicChange(updatedTopics);
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
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
                                    label={topic.name}
                                    checked={selectedTopics.includes(topic.topic_id)}
                                    onChange={() => handleTopicChange(topic.topic_id)}
                                />
                            </div>
                        ))}
                    </div>
                </Form.Group>
            </div>
        </>
    );
};

export default SubjectTopicSelector;
