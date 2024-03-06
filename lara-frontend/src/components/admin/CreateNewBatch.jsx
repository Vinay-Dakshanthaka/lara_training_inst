import React, { useEffect, useState } from 'react';
import { Form, Button, Toast, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftCircle } from 'react-icons/bs';

const EditableBatch = ({ batch, onUpdate, showSuccessToast, setShowSuccessToast, showErrorToast, setShowErrorToast }) => {
  const [batchName, setBatchName] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setBatchName(batch.batch_name);
  }, [batch]);

  const handleUpdate = async () => {
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

      const response = await axios.put('http://localhost:8080/api/student/updateBatch', {
        batch_id: batch.batch_id,
        batch_name: batchName
      }, config);

      console.log(response.data);
      setShowModal(false);
      onUpdate(batch.batch_id, batchName);
      setShowSuccessToast(true);
    } catch (error) {
      console.error(error);
      setShowErrorToast(true);
    }
  };

  return (
    <>
      <Button variant="info" className="me-2" onClick={() => setShowModal(true)}>Edit</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const CreateNewBatch = () => {
  const [batchName, setBatchName] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleInputChange = (event) => {
    setBatchName(event.target.value);
  };

  const fetchAvailableBatches = async () => {
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

      const response = await axios.get('http://localhost:8080/api/student/getAllBatches', config);
      setAvailableBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  useEffect(() => {
    fetchAvailableBatches();
  }, []);

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
      }, config);

      console.log(response.data);
      setShowSuccessToast(true);
      // Clear the form
      setBatchName('');
      // Fetch available batches again after adding a new batch
      fetchAvailableBatches();
    } catch (error) {
      console.error(error);
      setShowErrorToast(true);
    }
  };

  const handleDeleteBatch = async (batchId) => {
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

      const response = await axios.delete('http://localhost:8080/api/student/deleteBatch', {
        ...config,
        data: { batch_id: batchId }
      });

      console.log(response.data);
      setShowSuccessToast(true);
      // Fetch available batches again after deleting the batch
      fetchAvailableBatches();
    } catch (error) {
      console.error(error);
      setShowErrorToast(true);
    }
  };

  const handleUpdateBatch = (batchId, newName) => {
    setAvailableBatches(prevBatches =>
      prevBatches.map(batch =>
        batch.batch_id === batchId ? { ...batch, batch_name: newName } : batch
      )
    );
  };

  return (
    <div className="container mt-4">
      <div onClick={handleGoBack} className=" bg-transparent fw-bolder " style={{ position: 'absolute', left: 10, top: 60 , color:"black", fontWeight:"bolder" , fontSize:"1.5rem"}}>
        <BsArrowLeftCircle/>
      </div>
      <h1>Create New Batch</h1>
      <Form onSubmit={handleSubmit} className='card col-6'>
        <Form.Group className="mb-3 m-2" controlId="batchName">
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

        <Button variant="primary" type="submit" className='m-2'>
          Add
        </Button>
      </Form>

      {/* Available Batches Table */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Batch Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {availableBatches.map((batch, index) => (
            <tr key={batch.batch_id}>
              <td>{batch.batch_name}</td>
              <td>
                <EditableBatch batch={batch} onUpdate={handleUpdateBatch} showSuccessToast={showSuccessToast} setShowSuccessToast={setShowSuccessToast} showErrorToast={showErrorToast} setShowErrorToast={setShowErrorToast} />
                <Button variant="danger" onClick={() => handleDeleteBatch(batch.batch_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Success Toast */}
      <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide
        className="position-fixed top-0 end-0 mt-2 me-2" style={{ backgroundColor: 'rgba(40, 167, 69, 0.85)', color: 'white' }}>
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Success</Toast.Body>
      </Toast>

      {/* Error Toast */}
      <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={3000} autohide
        className="position-fixed top-0 end-0 mt-2 me-2" style={{ backgroundColor: 'rgba(220, 53, 69, 0.85)', color: 'white' }}>
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Something went wrong</Toast.Body>
      </Toast>
    </div>
  );
};

export default CreateNewBatch;
