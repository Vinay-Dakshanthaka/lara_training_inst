import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Container, Row, Col, Modal, Spinner, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import image from './excel_with_topic_id_to_upload.png';
import exampleSheet from './excelsheet_with_topic_ids.xlsx'; // Adjust this path as necessary
import { Link, useParams } from 'react-router-dom';

const UploadQuestionsToLinkByTopicIds = () => {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [subject, setSubject] = useState('');
    const { test_id } = useParams();
    const [placementTestDetails, setPlacementTestDetails] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [nonExistingTopics, setNonExistingTopics] = useState([]);
    const [nonLinkedTopics, setNonLinkedTopics] = useState([]);

    useEffect(() => {
        const fetchPlacementTestDetails = async () => {
            try {
                const response = await axios.post(
                    `${baseURL}/api/placement-test/getPlacementTestById`,
                    { placement_test_id: test_id }
                );
                setSubject(response.data.test_link);
                setPlacementTestDetails(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    toast.info('No Test details found');
                } else {
                    toast.error('Something went wrong');
                }
            }
        };

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
                if (error.response && error.response.status === 404) {
                    toast.info('No topics added for this link');
                } else {
                    console.error("Error fetching topics:", error);
                    toast.error(error.message);
                }
            }
        };

        fetchTopicsByPlacementTestId();
        fetchPlacementTestDetails();
    }, [test_id]);

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
            formData.append('link_topic_ids', JSON.stringify(topics.map(topic => topic.topic_id)));
            formData.append('placement_test_id', test_id);

            const response = await axios.post(`${baseURL}/api/placement-test/upload-questions-by-excel-topics`, formData, config);

            toast.success("Questions uploaded successfully!");

            setNonExistingTopics(response.data.nonExistingTopics);
            setNonLinkedTopics(response.data.nonLinkedTopics);
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
        link.href = exampleSheet;
        link.download = 'example_excel_sheet.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Example Excel sheet downloaded successfully!");
    };

    return (
        <Container>
            <hr />
            <h4>Upload Questions form multiple topics</h4>
            {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar /> */}
            <p className="lead">
                Upload questions using an Excel sheet containing the topic IDs listed below. This allows you to upload questions for multiple topics with a single Excel sheet. Please follow the example Excel sheet format provided below.
            </p>
            <p className="lead">
                <b>Note : </b> Questions will be uploaded for only the topic ids mentioned below. Make sure that provided topic id's are included in the excel sheet that you are going to upload
            </p>

            <table className='table table-bordered text-center'>
                <thead className="">
                    <tr>
                        <th>Topic Name </th>
                        <th>Topic ID</th>
                    </tr>
                </thead>
                {topics.map((topic) => (
                    <tr key={topic.topic_id}>
                        <td>{topic.topic_name}</td>
                        <td>{topic.topic_id}</td>
                    </tr>
                ))}
            </table>
            <Row>
                <Col md={6}>
                    <Form onSubmit={handleUpload}>
                        <Button variant="info" className="mt-3" onClick={handleShowModal}>
                            Example Excel Sheet Format to Upload
                        </Button>
                        <Button variant="primary" className="mt-3" onClick={handleDownload}>
                            Download Example Excel Sheet
                        </Button>
                        <Form.Group controlId="fileUpload" className="mt-3">
                            <Form.Label>Upload Questions</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} required />
                        </Form.Group>

                        <Button type="submit" className="mt-3" disabled={isUploading}>
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

            <Row className="mt-4">
                {nonExistingTopics.length > 0 && (
                    <Col>
                        <h5>Invalid Topics ID's</h5>
                        <Table striped bordered hover variant="info">
                            <thead>
                                <tr>
                                    <th>Topic ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nonExistingTopics.map((topic_id, index) => (
                                    <tr key={index}>
                                        <td>{topic_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                )}

                {nonLinkedTopics.length > 0 && (
                    <Col>
                        <h5>Not associated with this test link </h5>
                        <Table striped bordered hover variant="info">
                            <thead>
                                <tr>
                                    <th>Topic ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nonLinkedTopics.map((topic_id, index) => (
                                    <tr key={index}>
                                        <td>{topic_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                )}
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

export default UploadQuestionsToLinkByTopicIds;
