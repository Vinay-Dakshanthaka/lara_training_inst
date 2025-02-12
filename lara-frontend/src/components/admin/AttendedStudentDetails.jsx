// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { baseURL } from '../config';


// const AttendedStudentDetails = () => {
//   const [batches, setBatches] = useState([]); // Stores batch list
//   const [selectedBatch, setSelectedBatch] = useState(""); // Stores selected batch ID
//   const [attendedStudents, setAttendedStudents] = useState([]); // Stores attended students

//   // Fetch all batches
//   useEffect(() => {
//     const fetchBatches = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) return;
    
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
//             console.log(response.data,"-------------------fecthallbacths")
//             setBatches(response.data || []);
//           } catch (error) {
//             console.error('Error fetching batch details:', error);
//           }
//     };

//     fetchBatches();
//   }, []);

//   // Fetch attended students when batch is selected
//   useEffect(() => {
//     const fetchAttendedStudents = async () => {
//       if (selectedBatch) {
//         console.log(selectedBatch,"---------------selectedbatch")
//         try {
//           const token = localStorage.getItem("token");
//           if (!token) return;

//           const config = { headers: { Authorization: `Bearer ${token}` } };
//           const response = await axios.post(
//             `${baseURL}/api/paper-based-exams/getAttendedStudentsByBatch`,
//             { batchId: selectedBatch },
//             config
//           );

//           setAttendedStudents(response.data.attendedStudents || []);
//         } catch (error) {
//           console.error("Error fetching attended students:", error);
//         }
//       }
//     };

//     fetchAttendedStudents();
//   }, [selectedBatch]);

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-3">Attended Students by Batch</h2>

//       {/* Batch Selection Dropdown */}
//       <div className="mb-3">
//         <label className="form-label" >Select a Batch:</label>
//         <select
//             className="form-select"
//             value={selectedBatch}
//             onChange={(e) => setSelectedBatch(e.target.value)}
//             style={{ color: selectedBatch ? "black" : "gray" }} // Selected batch in black
//             >
//             <option value="" style={{ color: "gray" }}>-- Select a Batch --</option>
//             {batches.map((batch) => (
//                 <option key={batch.batch_id} value={batch.batch_id}>
//                 {batch.batch_name}
//                 </option>
//                 ))}
//                 </select>

//       </div>

//       {/* Display Attended Students */}
//       <div>
//   <h3>Attended Students</h3>
//   {attendedStudents.length > 0 ? (
//     <table className="table table-bordered">
//       <thead className="table-dark">
//         <tr>
//           <th>#</th>
//           <th>Student Name</th>
//           <th>Results</th>
//         </tr>
//       </thead>
//       <tbody>
//         {attendedStudents.map((name, index) => (
//           <tr key={index}>
//             <td>{index + 1}</td>
//             <td>{name}</td>
//           </tr>
//         ))}
//       </tbody>
//       <td></td>
//     </table>
//   ) : (
//     <p>No students attended the test for this batch.</p>
//   )}
// </div>

//     </div>
//   );
// };

// export default AttendedStudentDetails;import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../config";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import React, { useEffect, useState } from 'react';
import { Modal, Button } from "react-bootstrap";

const AttendedStudentDetails = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [attendedStudents, setAttendedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [totalBatchPercentage, setTotalBatchPercentage] = useState(0);
  const [overallTotalMarks, setOverallTotalMarks] = useState(0);
  const [overallObtainedMarks, setOverallObtainedMarks] = useState(0);
  
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
        setBatches(response.data || []);
        console.log(response.data,"---------------------------responsegetallbacths")
      } catch (error) {
        console.error("Error fetching batch details:", error);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchAttendedStudents = async () => {
      if (selectedBatch) {
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
          console.error("Error fetching attended students:", error);
        }
      }
    };

    fetchAttendedStudents();
  }, [selectedBatch]);

  const handleShowResults = (student) => {
    setSelectedStudent(student);
  };

  const downloadCertificate = () => {
    if (!selectedStudent) return;

    const input = document.getElementById("certificate-container");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Certificate_${selectedStudent.name}.pdf`);
    });
  };

  const getFeedback = (percentage) => {
    // Remove '%' if present and convert to number
    const numericPercentage = parseFloat(percentage.replace("%", ""));
    
    // Ensure we have a valid number
    if (isNaN(numericPercentage)) {
      console.error("Invalid percentage value:", percentage);
      return "Invalid Data";
    }
  
    // Extract integer part
    const roundedPercentage = Math.floor(numericPercentage);
    console.log("Original:", numericPercentage, "Rounded:", roundedPercentage); 
  
    // Determine feedback
    if (roundedPercentage >= 90) return "Excellent";
    if (roundedPercentage >= 75) return "Good";
    if (roundedPercentage >= 50) return "Average";
    if (roundedPercentage >= 35) return "Bad";
    return "Very Bad";
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
        console.log(response.data,"----------resultsbacthwise")
        const results = response.data || [];
         
        // Calculate overall results
        let totalMarks = 0;
        let totalObtainedMarks = 0;
            
         if (Array.isArray(results.attendedStudents)) {
            results.attendedStudents.forEach((student) => {
              totalMarks += student.totalMarks || 0;
              totalObtainedMarks += student.totalMarksObtained || 0;
            });
          } else {
            console.error("Expected an array, but got:", results);
          }

        console.log(totalMarks,"----------------totalmarks")
        console.log(totalObtainedMarks,"----------------tootalmarksobtained")
        // const percentage = totalMarks ? ((totalObtainedMarks / totalMarks) * 100).toFixed(2) : 0;
        const   percentage = totalMarks > 0 
        ? ((totalObtainedMarks / totalMarks) * 100).toFixed(2) + "%" 
        : "0%" // Handle cases where total marks is zero
      
        console.log(percentage,"percentage--------------------------------------")
        setOverallTotalMarks(totalMarks);
        setOverallObtainedMarks(totalObtainedMarks);
        setTotalBatchPercentage(percentage)
        setBatchResults(results);
        setShowModal(true);
      } catch (err) {
        setError("Failed to fetch batch results.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
  
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Attended Students by Batch</h2>
  
      <div className="mb-3">
        <label className="form-label">Select a Batch:</label>
        <select
          className="form-select"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          style={{ color: selectedBatch ? "black" : "gray" }}
        >
          <option value="" style={{ color: "gray" }}>-- Select a Batch --</option>
          {batches.map((batch) => (
            <option key={batch.batch_id} value={batch.batch_id}>
              {batch.batch_name}
            </option>
          ))}
        </select>

        <button className="btn btn-primary mt-2" onClick={fetchBatchResults}>
          Batchwise Results
        </button>
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
      </div>
  

  
      <h3>Attended Students</h3>
      {attendedStudents.length > 0 ? (
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attendedStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.totalTests}</td>
                <td>{student.totalMarksObtained}</td>
                <td>{student.totalMarks}</td>
                <td>{student.percentage}</td>
                <td>{getFeedback(student.percentage)}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleShowResults(student)}>
                    Show Results
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students attended the test for this batch.</p>
      )}
  
      {selectedStudent && (
        <div className="certificate mt-4 p-3 border" id="certificate-container">
          <h2 className="text-center">Certificate of Achievement</h2>
          <p><strong>Student Name:</strong> {selectedStudent.name}</p>
          <p><strong>Total Tests Attended:</strong> {selectedStudent.totalTests}</p>
          <p><strong>Marks Obtained:</strong> {selectedStudent.totalMarksObtained}</p>
          <p><strong>Total Marks:</strong> {selectedStudent.totalMarks}</p>
          <p><strong>Percentage:</strong> {selectedStudent.percentage}%</p>
          <p><strong>Feedback:</strong> {getFeedback(selectedStudent.percentage)}</p>
          <p className="text-center">Congratulations on your achievement!</p>
        </div>
      )}
  
      {selectedStudent && (
        <button className="btn btn-success mt-3" onClick={downloadCertificate}>
          Download Certificate as PDF
        </button>
      )}
    </div>
  );
};

export default AttendedStudentDetails;
