import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from './StudentList';

const TrainerDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

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
    setSelectedBatchId(batchId);
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
            <tr key={index} className={selectedBatchId === batch.batch_id ? 'bg-warning' : ''}>
              <td className={selectedBatchId === batch.batch_id ? 'bg-warning' : ''}>{batch.batch_name}</td>
              <td className={selectedBatchId === batch.batch_id ? 'bg-warning' : ''}>{batch.description}</td>
              <td className={selectedBatchId === batch.batch_id ? 'bg-warning' : ''}>{batch.duration}</td>
              <td className={selectedBatchId === batch.batch_id ? 'bg-warning' : ''}>
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
      {selectedBatchId && <StudentList batchId={selectedBatchId} />}
    </div>
  );
};

export default TrainerDashboard;
