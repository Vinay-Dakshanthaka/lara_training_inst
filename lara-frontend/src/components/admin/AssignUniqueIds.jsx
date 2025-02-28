import React, { useState } from "react";
import axios from "axios";
import { Button, Spinner, Alert } from "react-bootstrap";
import { baseURL } from "../config";

const AssignUniqueIds = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleAssignIds = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await axios.post(`${baseURL}/api/student/assignUniqueIdsToExistingStudents`);
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while processing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Assign Unique Student IDs</h3>
      <p>Click the button below to generate unique IDs for students with null IDs.</p>

      <Button variant="primary" onClick={handleAssignIds} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Generate Unique IDs"}
      </Button>

      {/* Response Display */}
      {response && (
        <Alert variant="success" className="mt-3">
          <h5>Process Completed!</h5>
          <p><strong>Students Processed:</strong> {response.processedCount}</p>
          {response.skippedStudents?.length > 0 && (
            <>
              <h6>Skipped Students:</h6>
              <ul>
                {response.skippedStudents.map((student, index) => (
                  <li key={index}>{student.studentId} - {student.reason}</li>
                ))}
              </ul>
            </>
          )}
        </Alert>
      )}

      {/* Error Message */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
};

export default AssignUniqueIds;
