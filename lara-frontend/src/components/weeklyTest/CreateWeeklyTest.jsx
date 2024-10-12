import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { baseURL } from '../config';
import SubjectTopicSelector from './SubjectTopicSelector';

const CreateWeeklyTest = () => {
    const [formData, setFormData] = useState({
        no_of_questions: '',
        test_date: '',
        is_active: true,
        is_monitored: false,
        wt_description: ''
    });
    
    const [selectedTopics, setSelectedTopics] = useState([]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const requestData = {
            ...formData,
            topic_ids: selectedTopics,
        };

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.post(`${baseURL}/api/weekly-test/createWeeklyTestLink`, requestData, config);
            toast.success(response.data.message);
            setFormData({
                no_of_questions: '',
                test_date: '',
                is_active: true,
                is_monitored: false,
                wt_description: ''
            });
            setSelectedTopics([]);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating weekly test');
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Create Weekly Test</h3>
            <Form onSubmit={handleSubmit}>
                <SubjectTopicSelector
                    selectedTopics={selectedTopics}
                    setSelectedTopics={setSelectedTopics}
                    onSubjectChange={() => {}}  // Add a handler if needed
                    onTopicChange={() => {}}  // Add a handler if needed
                />

                <Form.Group controlId="no_of_questions" className="mt-3">
                    <Form.Label>Number of Questions</Form.Label>
                    <Form.Control
                        type="number"
                        name="no_of_questions"
                        value={formData.no_of_questions}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="test_date" className="mt-3">
                    <Form.Label>Test Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="test_date"
                        value={formData.test_date}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="wt_description" className="mt-3">
                    <Form.Label>Test Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="wt_description"
                        value={formData.wt_description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Form.Group controlId="is_active" className="form-check">
                            <Form.Check
                                type="checkbox"
                                label="Is Active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="is_monitored" className="form-check">
                            <Form.Check
                                type="checkbox"
                                label="Is Monitored"
                                name="is_monitored"
                                checked={formData.is_monitored}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" className="mt-4">Create Test</Button>
            </Form>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default CreateWeeklyTest;
