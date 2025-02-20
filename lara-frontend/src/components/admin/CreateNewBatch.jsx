import React, { useEffect, useState } from 'react';
import { Form, Button, Table, Modal, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import Paginate from '../../components/common/Paginate';

const EditableBatch = ({ batch, onUpdate, showSuccessToast, setShowSuccessToast, showErrorToast, setShowErrorToast }) => {
  const [batchName, setBatchName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setBatchName(batch.batch_name);
    setPrice(batch.price);
    setDescription(batch.description);
    setDuration(batch.duration);
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

      const response = await axios.put(`${baseURL}/api/student/updateBatch`, {
        batch_id: batch.batch_id,
        batch_name: batchName,
        description: description,
        price: price,
        duration: duration,
      }, config);

      //console.log(response.data);
      setShowModal(false);
      onUpdate(batch.batch_id, batchName);
      // setShowSuccessToast(true);
      toast.success("Batch Details updated")
      setTimeout(() => {
        window.location.reload()
      }, 2000);
    } catch (error) {
      console.error(error);
      // setShowErrorToast(true);
      toast.error("Something went wrong")
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!batchName || batchName.length < 3) {
      errors.batchName = 'Batch name must be at least 3 characters';
    }

    if (!price.match(/^\d+(\.\d{1,2})?$/)) {
      errors.price = 'Price must be a number';
    }

    if (!duration) {
      errors.duration = 'Duration is required';
    }

    if (!description) {
      errors.description = 'Description is required';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      handleUpdate();
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
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="batchName">
              <Form.Label>Batch Name</Form.Label>
              <Form.Control
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                isInvalid={validationErrors.batchName}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.batchName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                isInvalid={validationErrors.price}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.price}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                isInvalid={validationErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="duration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                isInvalid={validationErrors.duration}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.duration}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" type="submit" className="ms-2">Update</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};


const CreateNewBatch = () => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);
  const [batchName, setBatchName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [batchIdToDelete, setBatchIdToDelete] = useState(null);
   // Pagination state
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 2; // Number of items per page
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Update the corresponding state variable based on the input name
    if (name === 'batchName') {
      setBatchName(value);
    } else if (name === 'description') {
      setDescription(value);
    } else if (name === 'price') {
      setPrice(value);
    } else if (name === 'duration') {
      setDuration(value);
    }
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

      const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
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
    const errors = {};

    if (batchName.length < 3) {
      errors.batchName = 'Batch name must be at least 3 characters';
    }

    if (!price.match(/^\d+(\.\d{1,2})?$/)) {
      errors.price = 'Price must be a number';
    }

    if (!duration.trim()) {
      errors.duration = 'Duration is required';
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
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

      const response = await axios.post(`${baseURL}/api/student/saveBatch`, {
        batch_name: batchName,
        description: description,
        price: parseFloat(price),
        duration: duration
      }, config);

      // console.log(response.data);
      // setShowSuccessToast(true);
      toast.success("Batch Added Successfully")

      // Clear the form and reset validation errors
      setBatchName('');
      setDescription('');
      setPrice('');
      setDuration('');
      setValidationErrors({});

      // Fetch available batches again after adding a new batch
      fetchAvailableBatches();
    } catch (error) {
      console.error(error);
      // setShowErrorToast(true);
      toast.error("Something went wrong!!!")
    }
  };



  const handleDeleteBatch = async (batchId) => {
    try {
      // Set the batch ID to be deleted
      setBatchIdToDelete(batchId);
      // Show the confirmation modal
      setShowConfirmationModal(true);
    } catch (error) {
      console.error(error);
      // setShowErrorToast(true);
      toast.error("Something went wrong!!!")
    }
  };

  const confirmDelete = async () => {
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

      const response = await axios.delete(`${baseURL}/api/student/deleteBatch`, {
        ...config,
        data: { batch_id: batchIdToDelete }
      });

      //console.log(response.data);//
      // setShowSuccessToast(true);
      toast.success('Batch Deleted Successfully')
      // Fetch available batches again after deleting the batch
      fetchAvailableBatches();
    } catch (error) {
      console.error(error);
      // setShowErrorToast(true);
      toast.error('Something went wrong')
    } finally {
      // Close the confirmation modal
      setShowConfirmationModal(false);
    }
  };


  const handleUpdateBatch = (batchId, newName) => {
    setAvailableBatches(prevBatches =>
      prevBatches.map(batch =>
        batch.batch_id === batchId ? { ...batch, batch_name: newName } : batch
      )
    );
  };
 
  // Pagination logic
  const indexOfLastBatch = currentPage * itemsPerPage;
  const indexOfFirstBatch = indexOfLastBatch - itemsPerPage;
  const currentBatches = availableBatches.slice(indexOfFirstBatch, indexOfLastBatch);

  return (
    <div className="container mt-4">


      <Container>
        <h1 className='text-center m-4'>Available Batch Details</h1>
        {/* Available Batches Table */}
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Batch Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentBatches.map((batch,index) => (
              <tr key={batch.batch_id}>
                <td>{index+1}</td>
                <td>
                
                  <div>
                    <strong>Batch Name:</strong> {batch.batch_name}
                  </div>
                  <div>
                    <strong>Description:</strong> {batch.description}
                  </div>
                  <div>
                    <strong>Duration:</strong> {batch.duration}
                  </div>
                  <div>
                    <strong>Price:</strong> {batch.price}
                  </div>
                </td>
                <td>
                  <EditableBatch batch={batch} onUpdate={handleUpdateBatch} showSuccessToast={showSuccessToast} setShowSuccessToast={setShowSuccessToast} showErrorToast={showErrorToast} setShowErrorToast={setShowErrorToast} />
                  <Button variant="danger" onClick={() => handleDeleteBatch(batch.batch_id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>

        </Table>
        {/* Pagination Component */}
      <Paginate
        currentPage={currentPage}
        totalItems={availableBatches.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage} // Update the page number when a new page is selected
      />
      </Container>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Form onSubmit={handleSubmit} className='card col-md-6 col-sm-8 col-10 shadow'>
          <div className='bg-primary col-12 card'>
            <h1 className='text-center'>Add New Batch</h1>
          </div>
          <Form.Group className="mb-3 m-2" controlId="batchName">
            <Form.Label>Batch Name</Form.Label>
            <Form.Control
              type="text"
              name="batchName"
              placeholder="Batch name"
              value={batchName}
              onChange={handleInputChange}
              isInvalid={validationErrors.batchName}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.batchName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 m-2" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Description"
              value={description}
              onChange={handleInputChange}
              isInvalid={validationErrors.description}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 m-2" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              name="price"
              placeholder="Price"
              value={price}
              onChange={handleInputChange}
              isInvalid={validationErrors.price}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.price}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 m-2" controlId="duration">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              name="duration"
              placeholder="Duration in months (e.g: 5 months)"
              value={duration}
              onChange={handleInputChange}
              isInvalid={validationErrors.duration}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.duration}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className='m-2'>
            Add
          </Button>
        </Form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      

      {/* Confirmation modal to delete */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this batch?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateNewBatch;
