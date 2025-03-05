
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import * as XLSX from 'xlsx';
import Paginate from '../common/Paginate';

const AttendedStudentDetails = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [attendedStudents, setAttendedStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const [batchResults, setBatchResults] = useState("");
  const [overallTotalMarks, setOverallTotalMarks] = useState("");
  const [overallObtainedMarks, setOverallObtainedMarks] = useState("");
  const [totalBatchPercentage, setTotalBatchPercentage] = useState("");
  const [showModal, setShowModal] = useState(false);

    // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    if (numericPercentage >= 35) return "Poor";
    return "Very Bad";
  };

  // const downloadExcel = () => {
  //   const data = selectedBatch ? attendedStudents : allStudents;
  //   if (data.length === 0) return;

  //   const batchName = selectedBatch
  //     ? batches.find(batch => batch.batch_id === Number(selectedBatch))?.batch_name || "Batch"
  //     : "All_Students";

  //   const formattedData = data.map(student => ({
  //     "Student Name": student.name,
  //     "Tests Attended": student.totalTests,
  //     "Marks Obtained": student.totalMarksObtained,
  //     "Total Marks": student.totalMarks,
  //     "Percentage": student.percentage,
  //     "Feedback": getFeedback(student.percentage)
  //   }));

  //   const ws = XLSX.utils.json_to_sheet(formattedData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Results");
  //   XLSX.writeFile(wb, `${batchName}_RESULTS.xlsx`);
  // };

  const downloadExcel = () => {
    const data = selectedBatch ? attendedStudents : allStudents;
    if (data.length === 0) return;

    const batchName = selectedBatch
        ? batches.find(batch => batch.batch_id === Number(selectedBatch))?.batch_name || "Batch"
        : "All_Students";

    // Format and sort data in descending order based on Percentage
    const formattedData = data
        .map(student => ({
            "Student Name": student.name,
            // "Tests Attended": student.totalTests,
            "Marks Obtained": student.totalMarksObtained,
            "Total Marks": student.totalMarks,
            "Percentage": student.percentage,
            // "Feedback": getFeedback(student.percentage)
        }))
        .sort((a, b) => b.Percentage - a.Percentage);  // Sort by Percentage in descending order

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, `${batchName}_RESULTS.xlsx`);
};

  const fetchBatchResults = async () => {
    if (!selectedBatch) {
      setError("Please select a batch.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(
        `${baseURL}/api/paper-based-exams/getBatchResults`,
        { batchId: selectedBatch },
        config
      );
      const results = response.data || [];
      let totalMarks = 0;
      let totalObtainedMarks = 0;
      if (Array.isArray(results.attendedStudents)) {
        results.attendedStudents.forEach((student) => {
          totalMarks += student.totalMarks || 0;
          totalObtainedMarks += student.totalMarksObtained || 0;
        });
      }
      const percentage = totalMarks > 0 
        ? ((totalObtainedMarks / totalMarks) * 100).toFixed(2) + "%" 
        : "0%";
      setOverallTotalMarks(totalMarks);
      setOverallObtainedMarks(totalObtainedMarks);
      setTotalBatchPercentage(percentage);
      setBatchResults(results);
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch batch results.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const getPagedData = () => {
    const data = selectedBatch ? attendedStudents : allStudents;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Student's PaperBased Exam  Results</h2>
      <div className="mb-3">
        <label className="form-label">Select a Batch:</label>
        <select className="form-select" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
          <option value="">-- Show All Students --</option>
          {batches.map(batch => (
            <option key={batch.batch_id} value={batch.batch_id}>{batch.batch_name}</option>
          ))}
        </select>
        <button className="btn btn-primary mt-2" onClick={fetchBatchResults}>Batchwise Results</button>
          <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1">
   <div className="modal-dialog">
     <div className="modal-content">
       <div className="modal-header">
         <h5 className="modal-title">Batch Results Summary</h5>
         <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
       </div>
       <div className="modal-body">
        <p><strong> Batch Percentage:</strong> {totalBatchPercentage}</p>
         <p><strong>Batch OverallObtainedMarks:</strong> {overallObtainedMarks}</p>
                  <p><strong>Batch OverallMarks:</strong> {overallTotalMarks}</p>
       </div>
      <div className="modal-footer">
         <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
      </div>
     </div>
  </div>
 </div>
        <button className="btn btn-success mt-2 ms-2" onClick={downloadExcel}>Download Results</button>
      </div>
      <h3>{selectedBatch ? "Batch-wise Results" : "All Students Results"}</h3>
      {loading ? <p>Loading...</p> : (
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
            {getPagedData().map((student, index) => (
              <tr key={student.studentId}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
       {/* Pagination Controls */}
       <Paginate
        currentPage={currentPage}
        totalItems={selectedBatch ? attendedStudents.length : allStudents.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    
    </div>
  );
};

export default AttendedStudentDetails;
