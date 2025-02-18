// import axios from "axios";
// import { baseURL } from "../config";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import React, { useEffect, useState } from 'react';
// import { Modal, Button } from "react-bootstrap";

// const AttendedStudentDetails = () => {
//   const [batches, setBatches] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [attendedStudents, setAttendedStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [batchResults, setBatchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [totalBatchPercentage, setTotalBatchPercentage] = useState(0);
//   const [overallTotalMarks, setOverallTotalMarks] = useState(0);
//   const [overallObtainedMarks, setOverallObtainedMarks] = useState(0);
  
//   useEffect(() => {
//     const fetchBatches = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const config = { headers: { Authorization: `Bearer ${token}` } };
//         const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
//         setBatches(response.data || []);
//         console.log(response.data,"---------------------------responsegetallbacths")
//       } catch (error) {
//         console.error("Error fetching batch details:", error);
//       }
//     };

//     fetchBatches();
//   }, []);

//   useEffect(() => {
//     const fetchAttendedStudents = async () => {
//       if (selectedBatch) {
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

//   const handleShowResults = (student) => {
//     setSelectedStudent(student);
//   };

  

//   const downloadCertificate = () => {
//     if (!selectedStudent) return;

//     const doc = new jsPDF("landscape"); // Landscape format
//     const presentDate = new Date().toLocaleString();

//     // Background Design
//     doc.setFillColor(76, 149, 228); // Blue background
//     doc.rect(0, 0, 297, 210, "F"); // Full-page rectangle
//     doc.setFillColor(255, 173, 63); // Orange curve
//     doc.circle(297, 105, 150, "F");

//     // Title
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const centerX = pageWidth / 2;

//     doc.setFont("times", "bold");
//     doc.setFontSize(28);
//     doc.setTextColor(255);
//     doc.text("CERTIFICATE OF ACHIEVEMENT", centerX, 50, null, null, "center");

//     doc.setFont("times", "italic");
//     doc.setFontSize(20);
//     doc.text("Proudly Presented to", centerX, 65, null, null, "center");

//     // Student Name
//     doc.setFont("times", "bold");
//     doc.setFontSize(26);
//     doc.setTextColor(0, 0, 0); // Black for name
//     doc.text(selectedStudent.name, centerX, 80, null, null, "center");

//     // Determine Performance Statement
//     let performanceStatement = "Keep pushing your limits!";
//     let percentage = selectedStudent.percentage || 0;

//     if (percentage >= 90) {
//         performanceStatement = "Outstanding Performance! Keep up the great work!";
//     } else if (percentage >= 75) {
//         performanceStatement = "Great Achievement! You're on the right path!";
//     } else if (percentage >= 50) {
//         performanceStatement = "Good Effort! Keep improving!";
//     } else {
//         performanceStatement = "Needs Improvement. Keep striving for excellence!";
//     }

//     // Student Performance Details
//     doc.setFont("times", "normal");
//     doc.setFontSize(16);
//     doc.setTextColor(40, 40, 40);

//     const performanceData = [
//         { label: "Total Marks Obtained:", value: selectedStudent.totalMarks || "N/A" },
//         { label: "Percentage:", value: percentage ? `${percentage}%` : "N/A" },
//         { label: "No. of Tests Attended:", value: selectedStudent.totalTests || "N/A" },
//     ];

//     let startY = 100;
//     performanceData.forEach((item, index) => {
//         doc.text(`${item.label} ${item.value}`, centerX, startY + index * 10, null, null, "center");
//     });

//     // Performance Message
//     doc.setFont("times", "italic");
//     doc.setFontSize(18);
//     doc.setTextColor(0, 0, 150);
//     doc.text(performanceStatement, centerX, startY + 40, null, null, "center");

//     // Footer
//     doc.setFont("times", "italic");
//     doc.setFontSize(10);
//     doc.setTextColor(200, 200, 200);
//     doc.text(`Generated on ${presentDate}`, centerX, 180, null, null, "center");

//     // Save Certificate
//     doc.save(`Performance_Certificate_${selectedStudent.name}.pdf`);
// };


//   const getFeedback = (percentage) => {
//     // Remove '%' if present and convert to number
//     const numericPercentage = parseFloat(percentage.replace("%", ""));
    
//     // Ensure we have a valid number
//     if (isNaN(numericPercentage)) {
//       console.error("Invalid percentage value:", percentage);
//       return "Invalid Data";
//     }
  
//     // Extract integer part
//     const roundedPercentage = Math.floor(numericPercentage);
//     console.log("Original:", numericPercentage, "Rounded:", roundedPercentage); 
  
//     // Determine feedback
//     if (roundedPercentage >= 90) return "Excellent";
//     if (roundedPercentage >= 75) return "Good";
//     if (roundedPercentage >= 50) return "Average";
//     if (roundedPercentage >= 35) return "Bad";
//     return "Very Bad";
//   };
  
//     const fetchBatchResults = async () => {
//       if (!selectedBatch) {
//         setError("Please select a batch.");
//         return;
//       }
  
//       setLoading(true);
//       setError("");
  
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;
  
//         const config = { headers: { Authorization: `Bearer ${token}` } };
//         const response = await axios.post(
//           `${baseURL}/api/paper-based-exams/getBatchResults`,
//           { batchId: selectedBatch },
//           config
//         );
//         console.log(response.data,"----------resultsbacthwise")
//         const results = response.data || [];
         
//         // Calculate overall results
//         let totalMarks = 0;
//         let totalObtainedMarks = 0;
            
//          if (Array.isArray(results.attendedStudents)) {
//             results.attendedStudents.forEach((student) => {
//               totalMarks += student.totalMarks || 0;
//               totalObtainedMarks += student.totalMarksObtained || 0;
//             });
//           } else {
//             console.error("Expected an array, but got:", results);
//           }

//         console.log(totalMarks,"----------------totalmarks")
//         console.log(totalObtainedMarks,"----------------tootalmarksobtained")
//         // const percentage = totalMarks ? ((totalObtainedMarks / totalMarks) * 100).toFixed(2) : 0;
//         const   percentage = totalMarks > 0 
//         ? ((totalObtainedMarks / totalMarks) * 100).toFixed(2) + "%" 
//         : "0%" // Handle cases where total marks is zero
      
//         console.log(percentage,"percentage--------------------------------------")
//         setOverallTotalMarks(totalMarks);
//         setOverallObtainedMarks(totalObtainedMarks);
//         setTotalBatchPercentage(percentage)
//         setBatchResults(results);
//         setShowModal(true);
//       } catch (err) {
//         setError("Failed to fetch batch results.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
  
  
//   return (
//     <div className="container mt-4">
//       <h2 className="mb-3">Attended Students by Batch</h2>
  
//       <div className="mb-3">
//         <label className="form-label">Select a Batch:</label>
//         <select
//           className="form-select"
//           value={selectedBatch}
//           onChange={(e) => setSelectedBatch(e.target.value)}
//           style={{ color: selectedBatch ? "black" : "gray" }}
//         >
//           <option value="" style={{ color: "gray" }}>-- Select a Batch --</option>
//           {batches.map((batch) => (
//             <option key={batch.batch_id} value={batch.batch_id}>
//               {batch.batch_name}
//             </option>
//           ))}
//         </select>

//         <button className="btn btn-primary mt-2" onClick={fetchBatchResults}>
//           Batchwise Results
//         </button>
//         <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1">
//   <div className="modal-dialog">
//     <div className="modal-content">
//       <div className="modal-header">
//         <h5 className="modal-title">Batch Results Summary</h5>
//         <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
//       </div>
//       <div className="modal-body">
//         <p><strong> Batch Percentage:</strong> {totalBatchPercentage}</p>
//         <p><strong>Batch OverallObtainedMarks:</strong> {overallObtainedMarks}</p>
//         <p><strong>Batch OverallMarks:</strong> {overallTotalMarks}</p>
//       </div>
//       <div className="modal-footer">
//         <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
//       </div>
//     </div>
//   </div>
// </div>
//       </div>
//        <h3>Attended Students</h3>
//       {attendedStudents.length > 0 ? (
//         <table className="table table-bordered">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>Student Name</th>
//               <th>Tests Attended</th>
//               <th>Marks Obtained</th>
//               <th>Total Marks</th>
//               <th>Percentage</th>
//               <th>Feedback</th>
//               {/* <th>Action</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {attendedStudents.map((student, index) => (
//               <tr key={student.id}>
//                 <td>{index + 1}</td>
//                 <td>{student.name}</td>
//                 <td>{student.totalTests}</td>
//                 <td>{student.totalMarksObtained}</td>
//                 <td>{student.totalMarks}</td>
//                 <td>{student.percentage}</td>
//                 <td>{getFeedback(student.percentage)}</td>
//                 {/* <td>
//                   <button className="btn btn-primary" onClick={() => handleShowResults(student)}>
//                     Show Results
//                   </button>
//                 </td> */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No students attended the test for this batch.</p>
//       )}
  
//       {selectedStudent && (
      
//         <div className="certificate mt-4 p-4 border rounded shadow-lg bg-light text-center" id="certificate-container">
//         <h2 className="text-primary">Certificate of Achievement</h2>
//         <hr />
//         <p className="font-italic">This certificate is proudly awarded to</p>
//         <h3 className="text-dark font-weight-bold">{selectedStudent.name}</h3>
//         <p>for demonstrating exceptional dedication and academic excellence.</p>
  
//         <p>
//           Having attended <strong>{selectedStudent.totalTests}</strong> tests, {selectedStudent.name} secured an impressive 
//           <strong> {selectedStudent.totalMarksObtained} out of {selectedStudent.totalMarks}</strong> marks, 
//           achieving an outstanding <strong>{selectedStudent.percentage}%</strong>.
//         </p>
  
//         <p>
//           This achievement reflects a strong commitment to learning and continuous improvement. 
//           Keep striving for success and reaching new milestones.
//         </p>
  
//         <p><strong>Feedback:</strong> {getFeedback(selectedStudent.percentage)}</p>
  
//         <hr />
//         <p className="text-success font-weight-bold">Congratulations on this well-deserved accomplishment!</p>
//       </div>
//       )}
  
//       {selectedStudent && (
//         <button className="btn btn-success mt-3" onClick={downloadCertificate}>
//           Download Certificate as PDF
//         </button>
//       )}
//     </div>
//   );
// };

// export default AttendedStudentDetails;

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
  const [error, setError] = useState("");
  const [batchResults, setBatchResults] = useState("");
  const [overallTotalMarks, setOverallTotalMarks] = useState("");
  const [overallObtainedMarks, setOverallObtainedMarks] = useState("");
  const [totalBatchPercentage, setTotalBatchPercentage] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Student Exam Results</h2>
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
    </div>
  );
};

export default AttendedStudentDetails;
