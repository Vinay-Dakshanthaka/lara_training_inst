import React, { useState } from 'react';
import { Form, Button, Toast } from 'react-bootstrap';
import axios from 'axios';

const CreateNewBatch = () => {
  const [batchName, setBatchName] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (event) => {
    setBatchName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (batchName.length < 3) {
      setValidationError('Batch name must be at least 3 characters');
      return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
    
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      const response = await axios.post('http://localhost:8080/api/student/saveBatch', {
        batch_name: batchName,
      },config);
      console.log(response.data);
      setShowSuccessToast(true);
    } catch (error) {
      console.error(error);
      setShowErrorToast(true);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create New Batch</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="batchName">
          <Form.Label>Batch Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter batch name"
            value={batchName}
            onChange={handleInputChange}
            isInvalid={validationError}
          />
          <Form.Control.Feedback type="invalid">
            {validationError}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Add
        </Button>
      </Form>

      {/* Success Toast */}
      <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide
        className="position-fixed top-0 end-0 mt-2 me-2" style={{ backgroundColor: 'rgba(40, 167, 69, 0.85)', color: 'white' }}>
        <Toast.Header>
          <strong className="me-auto">Success</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>Batch created successfully</Toast.Body>
      </Toast>

      {/* Error Toast */}
      <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={3000} autohide
        className="position-fixed top-0 end-0 mt-2 me-2" style={{ backgroundColor: 'rgba(220, 53, 69, 0.85)', color: 'white' }}>
        <Toast.Header>
          <strong className="me-auto">Error</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>Failed to create batch</Toast.Body>
      </Toast>
    </div>
  );
};

export default CreateNewBatch;
