import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { baseURL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../BackButton';
import { Container, Form, Button } from 'react-bootstrap';

const UploadWeeklyTestQuestions = () => {
    const { placement_test_id } = useParams();  // Get the wt_id from the URL
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]); // For dropdown topics
    const [selectedTopicId, setSelectedTopicId] = useState(''); // To store selected topic
    const [testDetails, setTestDetails] = useState(null); // For weekly test details
    const [error, setError] = useState(null);

    // Fetch weekly test details and associated topics
    useEffect(() => {
        const fetchTestDetails = async () => {
          try {
            const response = await axios.get(
              `${baseURL}/api/weekly-test/getDescriptiveTestById/${placement_test_id}`
            );
            console.log(response.data,"----------------------------dat")
            setTestDetails(response.data.test);
            setLoading(false);
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        };
    
        fetchTestDetails();
      }, [placement_test_id]);
    
    // Handle file change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Validate file type
    const validateFile = (file) => {
        const fileType = file.type;
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // .xlsx
            'application/vnd.ms-excel'  // .xls
        ];
        return validTypes.includes(fileType);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!wt_id || !selectedTopicId) {
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
        formData.append('wt_id', wt_id);  // Automatically use the wt_id from the URL
        formData.append('topic_id', selectedTopicId);  // Include the selected topic_id (now the correct one)

        try {
            const response = await axios.post(`${baseURL}/api/weekly-test/upload-questions`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success('Questions uploaded and saved successfully!');
            } else {
                toast.error('Error uploading questions.');
            }
        } catch (error) {
            toast.error(`Error uploading file: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <p>Error fetching test details: {error}</p>;
    }

    return (
        <>
        
                    <Container className='my-3'>
                <BackButton />
                <h3>Upload Weekly Test Questions</h3>
               
                {/* Display Weekly Test Details */}
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

                {/* Form to Upload Questions */}
                <form onSubmit={handleSubmit}>
                    {/* Dropdown to select topic */}
                    <Form.Group controlId="formTopicSelect" className="mb-3">
                        <Form.Label>Select Topic</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                            required
                        >
                            <option value="">-- Select a Topic --</option>
                            {topics.map((topic) => (
                                <option key={topic.TopicAssociation.topic_id} value={topic.TopicAssociation.topic_id}>
                                    {topic.TopicAssociation.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    {/* File input to upload Excel */}
                    <div className="mb-3">
                        <label className="form-label">Upload Excel File</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <Button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Questions'}
                    </Button>
                </form>
            </Container>

            <ToastContainer />
        </>
    );
};

export default UploadWeeklyTestQuestions;
