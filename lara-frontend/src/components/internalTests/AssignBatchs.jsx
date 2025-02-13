import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; // Importing Modal and Button from react-bootstrap

const AssignBatches = () => {
  const { internal_test_id } = useParams(); // Get internal_test_id from URL parameters
  const [assignedBatches, setAssignedBatches] = useState([]);
  const [unassignedBatches, setUnassignedBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]); // Store selected batches to assign
  const [showModal, setShowModal] = useState(false); // Modal state for confirmation

  // Fetch both assigned and unassigned batches when component mounts
  useEffect(() => {
    fetchBatches(internal_test_id);
  }, [internal_test_id]);

  // Fetch assigned and unassigned batches
  const fetchBatches = async (internalTestId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/internal-test/internal-test/${internalTestId}`);
      setAssignedBatches(response.data.assignedBatches || []);
      setUnassignedBatches(response.data.unassignedBatches || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  // Handle batch selection for assigning/unassigning
  const handleCheckboxChange = (batch, isAssigned) => {
    if (isAssigned) {
      // Add to selected batches for assignment
      setSelectedBatches(prevState => [...prevState, batch]);
    } else {
      // Remove from selected batches for assignment
      setSelectedBatches(prevState => prevState.filter(item => item.batch_id !== batch.batch_id));
    }
  };

  // Handle assigning selected batches to the internal test
  const handleAssignBatches = async () => {
    try {
      // Prepare the batch ids for assignment
      const batchIds = selectedBatches.map(batch => batch.batch_id);

      // Send API request to assign batches
      const response = await axios.post('http://localhost:8080/api/internal-test/assignBatchToInternalTest', {
        internal_test_id,
        batch_ids: batchIds
      });

      if (response.status === 200) {
        // Successfully assigned batches
        setAssignedBatches(prevState => [...prevState, ...selectedBatches]); // Update assigned batches
        setUnassignedBatches(prevState => prevState.filter(batch => !selectedBatches.some(b => b.batch_id === batch.batch_id))); // Remove from unassigned
        setSelectedBatches([]); // Clear selected batches
        setShowModal(true); // Show the confirmation modal
      }
    } catch (error) {
      console.error("Error assigning batches:", error);
    }
  };

  return (
    <div className='container mt-3 card shadow'>
      <h3>Assigned Batches</h3>
      <ul>
        {assignedBatches.length > 0 ? (
          assignedBatches.map((batch, index) => (
            <li key={index}>
              <input
                type="checkbox"
                checked
                disabled
              />
              {batch.batch_name} - {batch.description} - {batch.price}
            </li>
          ))
        ) : (
          <li>No assigned batches found.</li>
        )}
      </ul>

      <h3>Unassigned Batches</h3>
      <ul>
        {unassignedBatches.length > 0 ? (
          unassignedBatches.map((batch, index) => (
            <li key={index}>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(batch, true)} // Select to assign
              />
              {batch.batch_name} - {batch.description} - {batch.price}
            </li>
          ))
        ) : (
          <li>No unassigned batches found.</li>
        )}
      </ul>

      <Button variant="success" onClick={handleAssignBatches} disabled={selectedBatches.length === 0}>
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

export default AssignBatches;
