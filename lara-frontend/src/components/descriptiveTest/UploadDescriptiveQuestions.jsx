import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { baseURL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../BackButton';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import DescriptiveTestDetails from './DescriptiveTestDetails';
import UploadQuestionsExcelsheet from'./Example_Descriptive_Questions_Excelsheet.png';
const UploadDescriptiveQuestions = () => {
    const { placement_test_id } = useParams();  

    // State variables
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]); 
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [testDetails, setTestDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch test details and topics
    useEffect(() => {
        const fetchTestDetailsAndTopics = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/weekly-test/getDescriptiveTestById/${placement_test_id}`);
                setTestDetails(response.data.test);
                setTopics(response.data.test.TestTopics);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchTestDetailsAndTopics();
    }, [placement_test_id]);

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Validate file type
    const validateFile = (file) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
            'application/vnd.ms-excel'
        ];
        return validTypes.includes(file.type);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!placement_test_id || !selectedTopicId) {
            toast.error('Test ID and Topic ID are required.');
            return;
        }
        if (!file) {
            toast.error('Please upload an Excel file.');
            return;
        }
        if (!validateFile(file)) {
            toast.error('Invalid file type. Please upload an Excel file (.xls or .xlsx).');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('placement_test_id', placement_test_id);
        formData.append('topic_id', selectedTopicId);

        try {
            const response = await axios.post(`${baseURL}/api/placement-test/upload-questions`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast.success('Questions uploaded successfully!');
            } else {
                toast.error('Error uploading questions.');
            }
        } catch (err) {
            toast.error(`Error uploading file: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <p className="text-danger">Error fetching test details: {error}</p>;
    }

    // Show and hide modal
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Handle example file download
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = UploadQuestionsExcelsheet; // Use the imported file path
        link.download = 'Example_Descriptive_Questions_Excelsheet.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Example Excel sheet downloaded successfully!");
    };
    
    return (
        <>
            <DescriptiveTestDetails />
            <Container className="my-3">
                <BackButton />
                <h3>Upload Weekly Test Questions</h3>

                {/* Display Test Details */}
                {testDetails && (
                    <>
                        <h4>{testDetails.wt_description}</h4>
                        <p className="lead fw-bold">
                            <a href={testDetails.wt_link} target="_blank" rel="noopener noreferrer">
                                {testDetails.wt_link}
                            </a>
                        </p>
                    </>
                )}

                {/* Upload Form */}
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTopicSelect" className="mb-3">
                        <Form.Label>Select Topic</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                            required
                        >
                            <option value="">-- Select a Topic --</option>
                            {topics?.map((topic) => (
                                <option key={topic.PlacementTestTopic.topic_id} value={topic.PlacementTestTopic.topic_id}>
                                    {topic.PlacementTestTopic.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Button variant="info" className="mt-2" onClick={handleShowModal}>
                        Show Example Excel Sheet
                    </Button>
                    <Button variant="primary" className="mt-2 ms-2" onClick={handleDownload}>
                        Download Example Excel Sheet
                    </Button>

                    {/* File Upload */}
                    <div className="mb-3">
                        <label className="form-label">Upload Excel File</label>
                        <input type="file" className="form-control" onChange={handleFileChange} required />
                    </div>

                    <Button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Questions'}
                    </Button>
                </form>

                {/* Modal for Example Excel Sheet */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Example Excel Sheet Format</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <img src={UploadQuestionsExcelsheet} alt="Example Excel Sheet" className="img-fluid" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>

            <ToastContainer />
        </>
    );
};

export default UploadDescriptiveQuestions;
