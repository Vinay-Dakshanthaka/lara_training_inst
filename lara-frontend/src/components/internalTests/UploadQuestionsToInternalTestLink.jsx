import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import image from '../cumulativeTest/excel-sheet-example.png';
import excehlsheetWitoutId from '../placementTest/excel_with_topic_id_to_upload.png';
import { Link, useParams } from 'react-router-dom';

const UploadQuestionsToInternalTestLink = () => {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [internalTestDetails, setInternalTestDetails] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const { internal_test_id } = useParams();

    useEffect(() => {
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

        fetchInternalTestDetails();
    }, [internal_test_id]);

    const handleTopicChange = (e) => {
        setSelectedTopic(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = ['xlsx', 'xls'];

        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                toast.error("Invalid file type. Please upload an .xlsx or .xls file.");
                setFile(null);
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a valid file to upload.");
            return;
        }

        setIsUploading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            };

            const formData = new FormData();
            formData.append('file', file);

            await axios.post(`${baseURL}/api/internal-test/upload-questions-link`, formData, {
                params: {
                    topic_id: selectedTopic,
                    internal_test_id: internal_test_id
                },
                ...config,
            });

            toast.success("Questions uploaded successfully!");
        } catch (error) {
            console.error('Error uploading questions:', error);
            toast.error("Something went wrong while uploading the questions.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = excehlsheetWitoutId;
        link.download = 'example_excel_sheet_without_topic_id.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Example Excel sheet downloaded successfully!");
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

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

            <Row>
                <Col md={6}>
                    <Form onSubmit={handleUpload}>

                        {/* <Col md={6} className="mb-3">
                            <h5>Subject: {topics.length > 0 ? topics[0].subject_name : "N/A"}</h5>
                        </Col> */}

                        <p className="lead">
                            Upload questions by selecting a specific topic
                        </p>
                        <Form.Group controlId="topicSelect">
                            <Form.Label>Select Topic</Form.Label>
                            <Form.Control as="select" value={selectedTopic} onChange={handleTopicChange} required>
                                <option value="">-- Select Topic --</option>
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.topic_id}>
                                        {topic.topic_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="info" className="mt-3" onClick={handleShowModal}>
                            Example Excel Sheet Format to Upload
                        </Button>
                        <Button variant="primary" className="mt-3" onClick={handleDownload}>
                            Download Example Excel Sheet
                        </Button>
                        <Form.Group controlId="fileUpload">
                            <Form.Label>Upload Questions</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} required />
                        </Form.Group>

                        <Button type="submit" className="mt-3" disabled={!selectedTopic || isUploading}>
                            {isUploading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal} fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>Example Excel Sheet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={image} alt="Example Excel Sheet" className="img-fluid" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UploadQuestionsToInternalTestLink;
