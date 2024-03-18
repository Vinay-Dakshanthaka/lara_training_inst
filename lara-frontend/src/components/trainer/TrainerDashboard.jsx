import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from './StudentList';
import { useNavigate } from 'react-router-dom';
import {baseURL}  from '../config';

const TrainerDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const navigate = useNavigate();

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
          `${baseURL}/api/student/fetchBatchesAssignedToTrainer`,
          config
        );
        setBatches(response.data.batches);
      } catch (error) {
        console.error('Failed to fetch batches:', error);
      }
    };

    fetchBatches();
  }, []);

  const handleViewStudents = (batch_id) => {
    setSelectedBatchId(batch_id);
  };

  const handleAssignQuestion = (batch_id) => {
    navigate(`/assign-question/${batch_id}`);
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
            <th>Assign Questions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch, index) => (
            <tr key={index} className={selectedBatchId === batch.batch_id ? 'bg-warning' : ''}>
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
              <td>
                <button 
                  className="btn btn-warning" 
                  onClick={() => handleAssignQuestion(batch.batch_id)}
                >
                  Assign Question
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
