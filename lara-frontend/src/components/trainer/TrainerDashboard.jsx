import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainerDashboard = () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
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
  
        const response = await axios.get(
          'http://localhost:8080/api/student/fetchBatchesAssignedToTrainer',
          config
        );
        setBatches(response.data.batches);
      } catch (error) {
        console.error('Failed to fetch batches:', error);
      }
    };
  
    fetchBatches();
  }, []);
  
  const handleViewStudents = (batchId) => {
    // Implement the logic to view the list of students for the selected batch
    console.log('View students for batch:', batchId);
  };
  
  return (
    <div>
      <h1>Batch Details</h1>
      <table className="table m-5">
        <thead>
          <tr>
            <th>Batch Name</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Students</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch, index) => (
            <tr key={index}>
              <td>{batch.batch_name}</td>
              <td>{batch.description}</td>
              <td>{batch.duration}</td>
              <td>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleViewStudents(batch.batch_id)}
                >
                  View Students
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainerDashboard;
