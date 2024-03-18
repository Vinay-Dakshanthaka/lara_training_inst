import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import { BsTrash } from 'react-icons/bs';
import {baseURL}  from '../config';

const TrainerDetails = () => {
  const [trainerData, setTrainerData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const fetchData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.get(`${baseURL}/api/student/fetchAllTrainerAndBatch`, config)
      .then(response => {
        setTrainerData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    fetchAvailableBatches();
  };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchAvailableBatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
      setAvailableBatches(response.data);
    } catch (error) {
      console.error('Error fetching available batches:', error);
    }
  };

  const assignToBatch = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const trainerId = selectedTrainer.trainer.id;
      const batchIds = selectedBatches.map(batch => batch.batch_id);
      const response = await axios.post(`${baseURL}/api/student/assignBatchesToTrainer`, { trainerId, batchIds }, config);
      setToastMessage('Batches assigned successfully');
      setToastVariant('success');
      setShowToast(true);
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error assigning batches:', error);
      setToastMessage('Failed to assign batches');
      setToastVariant('error');
      setShowToast(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTrainer(null);
    setSelectedBatches([]);
  };

  const deassignTrainerFromBatch = async (trainerId, batchId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${baseURL}/api/student/deassignBatchFromTrainer`, { trainerId, batchId }, config);
      setToastMessage('Batch de-assigned successfully');
      setToastVariant('success');
      setShowToast(true);
      fetchData();
    } catch (error) {
      console.error('Error de-assigning trainer from batch:', error);
      setToastMessage('Something went wrong');
      setToastVariant('error');
      setShowToast(true);
    }
  };
  return (
    <div>
      <h2>Trainer Details</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Batch Name</th>
            <th>Assign Batch</th>
          </tr>
        </thead>
        <tbody>
          {trainerData.map(trainerInfo => (
            <tr key={trainerInfo.trainer.id}>
              <td>{trainerInfo.trainer.name}</td>
              <td>{trainerInfo.trainer.email}</td>
              <td>{trainerInfo.trainer.phoneNumber}</td>
              <td>
                {trainerInfo.batches.length > 0 ? (
                  <ul>
                    {trainerInfo.batches.map(batch => (
                      <li key={batch.batch_id}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span>{batch.batch_name}</span>
                          <button className="btn btn-danger ms-2 m-1" onClick={() => deassignTrainerFromBatch(trainerInfo.trainer.id, batch.batch_id)}>
                            <BsTrash />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No batches"
                )}
              </td>

              <td>
                <Button variant="primary" onClick={() => {
                  setSelectedTrainer(trainerInfo);
                  setShowModal(true);
                }}>
                  Assign Batch
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p><strong>Name: </strong>{selectedTrainer && selectedTrainer.trainer.name}</p>
            <p><strong>Email: </strong>{selectedTrainer && selectedTrainer.trainer.email}</p>
            <p><strong>Phone Number: </strong>{selectedTrainer && selectedTrainer.trainer.phoneNumber}</p>
          </div>
          <Form>
            {availableBatches.map(batch => {
              const isAssigned = selectedTrainer && selectedTrainer.batches.some(tBatch => tBatch.batch_id === batch.batch_id);
              if (!isAssigned) {
                return (
                  <Form.Check
                    key={batch.batch_id}
                    type="checkbox"
                    id={`batch-${batch.batch_id}`}
                    label={batch.batch_name}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const batchId = batch.batch_id;
                      if (checked) {
                        setSelectedBatches(prevSelectedBatches => [...prevSelectedBatches, batch]);
                      } else {
                        setSelectedBatches(prevSelectedBatches => prevSelectedBatches.filter(b => b.batch_id !== batchId));
                      }
                    }}
                  />
                );
              }
              return null;
            })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={assignToBatch}>
            Assign to Batch
          </Button>
        </Modal.Footer>
      </Modal>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: '3rem',
          right: '1rem',
          minWidth: '200px', // Adjust width as needed
          zIndex: 9999 // Ensure it's on top of other content
        }}
      >
        <Toast.Body style={{ backgroundColor: toastVariant === 'success' ? '#28a745' : '#dc3545', color: '#fff' }}>
          {toastMessage}
        </Toast.Body>
      </Toast>

    </div>
  );
};

export default TrainerDetails;
