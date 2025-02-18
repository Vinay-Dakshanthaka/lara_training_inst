import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const AssignBatchsTowt = () => {
  const { wt_id } = useParams(); // Get wt_id from URL parameters
  const [assignedBatches, setAssignedBatches] = useState([]);
  const [unassignedBatches, setUnassignedBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]); // Store selected batches to assign
  const [showModal, setShowModal] = useState(false); // Modal state for confirmation

  // Fetch both assigned and unassigned batches when component mounts
  useEffect(() => {
    fetchBatches(wt_id);
  }, [wt_id]);

  // Fetch assigned and unassigned batches
  const fetchBatches = async (wt_id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/internal-test/weekly-test/${wt_id}`);
      setAssignedBatches(response.data.assignedBatches || []);
      setUnassignedBatches(response.data.unassignedBatches || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  // Handle batch selection for assigning/unassigning
  const handleCheckboxChange = (batch, isChecked) => {
    if (isChecked) {
      setSelectedBatches(prevState => [...prevState, batch]);
    } else {
      setSelectedBatches(prevState => prevState.filter(item => item.batch_id !== batch.batch_id));
    }
  };

  // Handle assigning selected batches to the internal test
  const handleAssignBatches = async (wt_id) => {
    try {
      // Prepare the batch ids for assignment
      const batchIds = selectedBatches.map(batch => batch.batch_id);

      // Send API request to assign batches
      const response = await axios.post('http://localhost:8080/api/internal-test/assignBatchToWeeklyTest', {
        wt_id,
        batch_ids: batchIds
      });

      if (response.status === 200) {
        // Successfully assigned batches
        setAssignedBatches(prevState => [
          ...prevState,
          ...selectedBatches.filter(
            newBatch => !prevState.some(existingBatch => existingBatch.batch_id === newBatch.batch_id)
          ),
        ]); // Update assigned batches

        setUnassignedBatches(prevState => prevState.filter(batch => !selectedBatches.some(b => b.batch_id === batch.batch_id))); // Remove from unassigned
        setSelectedBatches([]); // Clear selected batches
        setShowModal(true); // Show the confirmation modal
      }
    } catch (error) {
      console.error("Error assigning batches:", error);
    }
  };

  return (
    <div>
      <h3>Assigned Batches</h3>
      {assignedBatches.length > 0 ? (
        <div>
          {assignedBatches.map((batch, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <Form.Check
                type="checkbox"
                label={`${batch.batch_name} - ${batch.description} - ${batch.price}`}
                checked
                disabled
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No assigned batches found.</p>
      )}

      <h3>Unassigned Batches</h3>
      {unassignedBatches.length > 0 ? (
        <div>
          {unassignedBatches.map((batch, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <Form.Check
                type="checkbox"
                label={`${batch.batch_name} - ${batch.description} - ${batch.price}`}
                onChange={(e) => handleCheckboxChange(batch, e.target.checked)} // Select to assign
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No unassigned batches found.</p>
      )}

      <Button
        variant="success"
        onClick={() => handleAssignBatches(wt_id)}
        disabled={selectedBatches.length === 0}
        style={{ marginTop: '20px' }}
      >
        Assign Selected Batches
      </Button>

      {/* Modal to confirm the batch assignment */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Batch Assignment Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The selected batches have been successfully assigned to the internal test.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignBatchsTowt;
