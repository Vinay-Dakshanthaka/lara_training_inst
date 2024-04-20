import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, Toast } from 'react-bootstrap';
import QuestionList from './QuestionList';
import { baseURL } from '../config';
import BackButton from '../BackButton';

const AssignQuestion = () => {
    const { batch_id } = useParams();
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null); // New state for image
    const [imagePreview, setImagePreview] = useState(null); // New state for image preview
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [questionError, setQuestionError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [batchDetails, setBatchDetails] = useState(null);

    useEffect(() => {
        const fetchBatchDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.post(
                    `${baseURL}/api/student/getBatchById`,
                    { batch_id }, config
                );
                setBatchDetails(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBatchDetails();
    }, [batch_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setQuestionError('');
        setDescriptionError('');

        if (!question.trim()) {
            setQuestionError('Question is required');
            return;
        }
        if (!description.trim()) {
            setDescriptionError('Description is required');
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Set content type for file upload
                },
            };
            const formData = new FormData();
            formData.append('batch_id', batch_id);
            formData.append('question', question);
            formData.append('description', description);
            formData.append('image', image); // Append image to form data

            const response = await axios.post(`${baseURL}/api/student/saveQuestion`, formData, config);
            setQuestion('');
            setDescription('');
            setImage(null); // Reset image state
            setImagePreview(null); // Reset image preview state
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
            window.location.reload();
        } catch (error) {
            console.error('Failed to save question:', error);
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 3000);
        }
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
        setImagePreview(URL.createObjectURL(selectedImage)); // Create image preview URL
    };

    return (
        <div className='card m-4'>
            <BackButton />
            <h1>Give Assignment Questions</h1>
            <form onSubmit={handleSubmit} className='card p-2'>
                <div className="mb-3">
                    <label htmlFor="question" className="form-label"><b>Question</b></label>
                    <textarea
                        className={`form-control ${questionError ? 'is-invalid' : ''}`}
                        id="question"
                        rows="3"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    ></textarea>
                    {questionError && <div className="invalid-feedback">{questionError}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label"><b>Description</b></label>
                    <textarea
                        className={`form-control ${descriptionError ? 'is-invalid' : ''}`}
                        id="description"
                        rows="5"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                    {descriptionError && <div className="invalid-feedback">{descriptionError}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label"><b>Question Image</b></label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        onChange={handleImageChange} // Call handleImageChange on file selection
                    />
                </div>
                {imagePreview && (
                    <img src={imagePreview} alt="Question Preview" style={{ width:'300px', height:'300px', marginBottom: '10px' }} />
                )}
                <div className='text-center'>
                    <button type="submit" className="btn btn-primary">Add Question</button>
                </div>
            </form>
            <QuestionList batchId={batch_id} />
            <ToastContainer className="p-3" position="top-end" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '1000' }}>
                <Toast bg="success" show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
                    <Toast.Body>Question added successfully!</Toast.Body>
                </Toast>
                <Toast bg="danger" show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={3000} autohide>
                    <Toast.Body>Something went wrong. Please try again later.</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default AssignQuestion;
