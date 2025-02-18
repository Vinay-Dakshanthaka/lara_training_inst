import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import * as XLSX from 'xlsx';

const AttendedStudentDetails = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [attendedStudents, setAttendedStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
        setBatches(response.data || []);
      } catch (error) {
        console.error("Error fetching batch details:", error);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/paper-based-exams/getAllStudentsExamAttended`);
        setAllStudents(response.data?.data || []);
        console.log(response.data,"--------------------allstudents")
      } catch (error) {
        console.error("Error fetching all students results:", error);
      }
    };
    fetchAllStudents();
  }, []);

  useEffect(() => {
    const fetchBatchStudents = async () => {
      if (!selectedBatch) {
        setAttendedStudents([]); 
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(
          `${baseURL}/api/paper-based-exams/getAttendedStudentsByBatch`,
          { batchId: selectedBatch },
          config
        );
        setAttendedStudents(response.data.attendedStudents || []);
        console.log(response.data,"-----------------bacthwiseattend students")
      } catch (error) {
        console.error("Error fetching batch students:", error);
        setAttendedStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBatchStudents();
  }, [selectedBatch]);

  const getFeedback = (percentage) => {
    const numericPercentage = parseFloat(percentage.replace("%", ""));
    if (isNaN(numericPercentage)) return "Invalid Data";
    if (numericPercentage >= 90) return "Excellent";
    if (numericPercentage >= 75) return "Good";
    if (numericPercentage >= 50) return "Average";
    if (numericPercentage >= 35) return "Bad";
    return "Very Bad";
  };

  const downloadExcel = () => {
    const data = selectedBatch ? attendedStudents : allStudents;
    if (data.length === 0) return;

    const batchName = selectedBatch
      ? batches.find(batch => batch.batch_id === Number(selectedBatch))?.batch_name || "Batch"
      : "All_Students";

    const formattedData = data.map(student => ({
      "Student Name": student.name,
      "Tests Attended": student.totalTests,
      "Marks Obtained": student.totalMarksObtained,
      "Total Marks": student.totalMarks,
      "Percentage": student.percentage,
      "Feedback": getFeedback(student.percentage)
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, `${batchName}_RESULTS.xlsx`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Student Exam Results</h2>

      <div className="mb-3">
        <label className="form-label">Select a Batch:</label>
        <select
          className="form-select"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
        >
          <option value="">-- Show All Students --</option>
          {batches.map(batch => (
            <option key={batch.batch_id} value={batch.batch_id}>
              {batch.batch_name}
            </option>
          ))}
        </select>

        <button className="btn btn-success mt-2 ms-2" onClick={downloadExcel}>
          Download Results
        </button>
      </div>

      <h3>{selectedBatch ? "Batch-wise Results" : "All Students Results"}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Tests Attended</th>
              <th>Marks Obtained</th>
              <th>Total Marks</th>
              <th>Percentage</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {(selectedBatch ? attendedStudents : allStudents).map((student, index) => (
              <tr key={student.studentId}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.totalTests}</td>
                <td>{student.totalMarksObtained}</td>
                <td>{student.totalMarks}</td>
                <td>{student.percentage}</td>
                <td>{getFeedback(student.percentage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(!selectedBatch && allStudents.length === 0) && <p>No students have attended exams yet.</p>}
      {(selectedBatch && attendedStudents.length === 0) && <p>No students attended the test for this batch.</p>}
    </div>
  );
};

export default AttendedStudentDetails;
