import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, Toast } from 'react-bootstrap';
import QuestionList from './QuestionList';
import {baseURL}  from '../config';

const AssignQuestion = () => {
    const { batch_id } = useParams();
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
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
              { batch_id },config
            );
    
            // Assuming response.data contains the batch details
            setBatchDetails(response.data);
            console.log("batch details :",response.data)
          } catch (error) {
            console.log("Error fetching Batch Details :",error)
          }
        };
    
        fetchBatchDetails();
      }, [batch_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Reset error messages
        setQuestionError('');
        setDescriptionError('');
        // Validate textarea fields
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
                },
            };
            const formData = { batch_id, question, description };
            const response = await axios.post(`${baseURL}/api/student/saveQuestion`, formData, config);
            console.log('Question saved successfully:', response.data);
            // Reset form fields after successful submission
            setQuestion('');
            setDescription('');
            // Show success toast
            setShowSuccessToast(true);
            // Hide success toast after 3 seconds
            setTimeout(() => setShowSuccessToast(false), 3000);
            // Reload QuestionList component to show newly added question
            window.location.reload();
        } catch (error) {
            console.error('Failed to save question:', error);
            // Show error toast
            setShowErrorToast(true);
            // Hide error toast after 3 seconds
            setTimeout(() => setShowErrorToast(false), 3000);
        }
    };

    return (
        <div className='card m-4'>
            <h1>Give Assignment Questions</h1>
            {/* <h3>Batch Name : {batchDetails.batch_name}</h3> */}
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
