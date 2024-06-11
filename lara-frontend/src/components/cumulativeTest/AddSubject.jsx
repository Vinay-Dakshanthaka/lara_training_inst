import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Row, Col } from 'react-bootstrap';
import { baseURL } from '../config';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { BsPencil, BsTrash } from 'react-icons/bs';

const AddSubject = () => {
    const [subjectName, setSubjectName] = useState('');
    const [topicName, setTopicName] = useState('');
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSubjectId, setCurrentSubjectId] = useState(null);
    const [currentTopicId, setCurrentTopicId] = useState(null);
    const [errors, setErrors] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [showSubjectDeleteConfirmationModal, setShowSubjectDeleteConfirmationModal] = useState(false);
    const [showTopicDeleteConfirmationModal, setShowTopicDeleteConfirmationModal] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState(null);

    const handleAddSubject = () => {
        setIsEditMode(false);
        setShowSubjectModal(true);
    };

    const handleEditSubject = async (subjectId) => {
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
            const response = await axios.get(`${baseURL}/api/cumulative-test/getSubjectById`, {
                params: { subject_id: subjectId },
                ...config,
            });

            setSubjectName(response.data.name);
            setCurrentSubjectId(subjectId);
            setIsEditMode(true);
            setShowSubjectModal(true);
        } catch (error) {
            console.error('Error fetching subject:', error);
        }
    };

    const handleEditTopic = async (topicId) => {
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
            const response = await axios.get(`${baseURL}/api/cumulative-test/getTopicById`, {
                params: { topic_id: topicId },
                ...config,
            });

            setTopicName(response.data.name);
            setCurrentTopicId(topicId);
            setIsEditMode(true);
            setShowTopicModal(true);
        } catch (error) {
            console.error('Error fetching topic:', error);
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        setSubjectToDelete(subjectId);
        setShowSubjectDeleteConfirmationModal(true);
    };
    
    const handleDeleteTopic = async (topicId) => {
        setTopicToDelete(topicId);
        setShowTopicDeleteConfirmationModal(true);
    };

    const confirmDeleteSubject = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    subject_id: subjectToDelete
                }
            };

            await axios.delete(`${baseURL}/api/cumulative-test/deleteSubject`, config);
            toast.success("Subject Deleted Successfully!!");
            fetchSubjects();
            setShowSubjectDeleteConfirmationModal(false);
        } catch (error) {
            console.error('Error deleting subject:', error);
            toast.error("Something went wrong!!!");
        }
    };

    
    const confirmDeleteTopic = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    topic_id: topicToDelete
                }
            };
    
            await axios.delete(`${baseURL}/api/cumulative-test/deleteTopic`, config);
            toast.success("Topic Deleted Successfully!!");
            fetchSubjects();
            setShowTopicDeleteConfirmationModal(false);
        } catch (error) {
            console.error('Error deleting topic:', error);
            toast.error("Something went wrong!!!");
        }
    };
    

    const handleAddTopic = (subjectId) => {
        setCurrentSubjectId(subjectId);
        setIsEditMode(false);
        setShowTopicModal(true);
    };

    const handleCloseModals = () => {
        setShowSubjectModal(false);
        setShowTopicModal(false);
        setShowTopicDeleteConfirmationModal(false);
        setShowSubjectDeleteConfirmationModal(false);
        setErrors('');
        setSubjectName('');
        setTopicName('');
    };

    const handleSubjectSubmit = async (e) => {
        e.preventDefault();
        if (!subjectName.trim()) {
            setErrors('Subject name is required');
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

            if (isEditMode) {
                const response = await axios.put(`${baseURL}/api/cumulative-test/updateSubject`, {
                    subject_id: currentSubjectId,
                    subject_name: subjectName
                }, config);
                toast.success("Subject Updated");
            } else {
                const response = await axios.post(`${baseURL}/api/cumulative-test/saveSubject`, {
                    subject_name: subjectName
                }, config);
                toast.success("Subject Added");
            }

            fetchSubjects();
            handleCloseModals();
        } catch (error) {
            console.error('Error:', error);
            toast.error("Something went wrong");
        }
    };

    const handleTopicSubmit = async (e) => {
        e.preventDefault();
        if (!topicName.trim()) {
            setErrors('Topic name is required');
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

            if (isEditMode) {
                const response = await axios.put(`${baseURL}/api/cumulative-test/updateTopic`, {
                    topic_id: currentTopicId,
                    topic_name: topicName
                }, config);
                toast.success("Topic Updated");
            } else {
                const response = await axios.post(`${baseURL}/api/cumulative-test/saveTopic`, {
                    subject_id: currentSubjectId,
                    topic_name: topicName
                }, config);
                toast.success("Topic Added");
            }

            fetchSubjects();
            handleCloseModals();
        } catch (error) {
            console.error('Error:', error);
            toast.error("Something went wrong");
        }
    };

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
            const response = await axios.get(`${baseURL}/api/cumulative-test/getAllSubjectsAndTopics`, config);
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    return (
        <>
            <Button className="btn btn-primary" onClick={handleAddSubject}>
                Add Subject
            </Button>
            <hr />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Subject Name</th>
                        <th>Topics</th>
                        <th>Add Topic</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                        <tr key={subject.id}>
                            <td>
                                <Row>
                                    <Col>{subject.name}</Col>
                                    <Col md="auto">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleEditSubject(subject.subject_id)}
                                        >
                                            <BsPencil />
                                        </Button>
                                    </Col>
                                    <Col md="auto">
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteSubject(subject.subject_id)}
                                        >
                                            <BsTrash />
                                        </Button>
                                    </Col>
                                </Row>
                            </td>
                            <td>
                                <ul>
                                    {subject.topics.map((topic) => (
                                        <li key={topic.id} style={{ margin: '5px' }}>
                                            <Row>
                                                <Col>{topic.name}</Col>
                                                <Col md="auto">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleEditTopic(topic.topic_id)}
                                                    >
                                                        <BsPencil />
                                                    </Button>
                                                </Col>
                                                <Col md="auto">
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteTopic(topic.topic_id)}
                                                    >
                                                        <BsTrash />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleAddTopic(subject.subject_id)}>Add Topic</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showSubjectModal} onHide={handleCloseModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Subject' : 'Add Subject'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubjectSubmit}>
                        <Form.Group>
                            <Form.Label htmlFor="subjectName">Subject Name</Form.Label>
                            <Form.Control
                                type="text"
                                id="subjectName"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                isInvalid={!!errors}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" className="btn btn-primary mt-3">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showTopicModal} onHide={handleCloseModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Topic' : 'Add Topic'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleTopicSubmit}>
                        <Form.Group>
                            <Form.Label htmlFor="topicName">Topic Name</Form.Label>
                            <Form.Control
                                type="text"
                                id="topicName"
                                value={topicName}
                                onChange={(e) => setTopicName(e.target.value)}
                                isInvalid={!!errors}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" className="btn btn-primary mt-3">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showSubjectDeleteConfirmationModal} onHide={() => setShowSubjectDeleteConfirmationModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this subject and all its topics?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSubjectDeleteConfirmationModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteSubject}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showTopicDeleteConfirmationModal} onHide={() => setShowTopicDeleteConfirmationModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this topic this will delete all the questions related to this topic?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTopicDeleteConfirmationModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteTopic}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </>
    );
};

export default AddSubject;
