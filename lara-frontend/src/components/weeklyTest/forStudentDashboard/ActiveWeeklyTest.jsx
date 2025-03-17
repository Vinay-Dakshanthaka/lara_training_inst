

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Container, Badge } from "react-bootstrap";
// import { baseURL } from "../../config";
// import { Link } from "react-router-dom";
// import Paginate from "../../common/Paginate";

// const ActiveWeeklyTests = () => {
//   const [activeTests, setActiveTests] = useState([]);
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [testsPerPage] = useState(5);

//   // Fetch token
//   const token = localStorage.getItem("token");
//   if (!token) throw new Error("No token provided.");

//   const config = { headers: { Authorization: `Bearer ${token}` } };

//   useEffect(() => {
//     const fetchTests = async () => {
//       try {
//         // Fetch student and active tests
//         const { data } = await axios.get(
//           `${baseURL}/api/weekly-test/getStudentAndActiveTestsWithAttendance`,
//           config
//         );
//         setStudentDetails(data.student);
//           console.log(data.
//             testType
//             ,"-------------------------------data")
//             if(data.testType == true){
//               // skip that testlink displaying
//             }
//         // Fetch obtained marks and final submission status
//         const testsWithMarks = await Promise.all(
//           data.active_tests.map(async (test) => {
//             const response = await axios.get(
//               `${baseURL}/api/weekly-test/getAllIndividualStudentResultsForTest/${test.test_id}`
//             );
//             console.log(response.data,"-----------------------------responseweekly")
//             const studentResults = response.data.student_results;
//             const studentResult = studentResults.find(
//               (result) => result.student_id === data.student.student_id
//             );

//             // Check final submission status
//             let finalSubmission = false;
//             if (studentResult) {
//               const submissionResponse = await axios.post(
//                 `${baseURL}/api/weekly-test/checkAndSubmitTest`,
//                 {
//                   student_id: data.student.student_id,
//                   wt_id: test.test_id,
//                 }
//               );
//               finalSubmission = submissionResponse.data.result?.final_submission || false;
//             }

//             return {
//               ...test,
//               has_attended: !!studentResult,
//               obtained_marks: studentResult?.obtained_marks ?? null,
//               total_available_marks: studentResult?.total_available_marks ?? 0,
//               final_submission: finalSubmission,
//             };
//           })
//         );

//         const sortedTests = testsWithMarks.sort((a, b) => b.test_id - a.test_id);
//         setActiveTests(sortedTests);
//       } catch (error) {
//         console.error("Error fetching active tests or student results:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTests();
//   }, [token]);

//   const indexOfLastTest = currentPage * testsPerPage;
//   const indexOfFirstTest = indexOfLastTest - testsPerPage;
//   const currentTests = activeTests.slice(indexOfFirstTest, indexOfLastTest);
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading) {
//     return <Container className="mt-4">Loading...</Container>;
//   }

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center">Weekly Tests</h2>
//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>Test Description</th>
//             <th>Test Date</th>
//             <th>Total Marks</th>
//             <th>Obtained Marks</th>
//             <th>Status</th>
//             <th>Detailed Summary</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentTests.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="text-center">
//                 No active weekly tests available.
//               </td>
//             </tr>
//           ) : (
//             currentTests.map((test) => (
//               <tr key={test.test_id}>
//                 <td>
//                   <a
//                     href={test.test_link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {test.test_description}
//                   </a>
//                 </td>
//                 <td>{test.test_date}</td>
//                 <td>
//                   {test.has_attended && test.final_submission
//                     ? test.total_available_marks
//                     : "N/A"}
//                 </td>
//                 <td>
//                   {test.has_attended && test.final_submission
//                     ? test.obtained_marks
//                     : test.has_attended
//                     ? "Pending"
//                     : "N/A"}
//                 </td>
//                 <td>
//                   {test.has_attended ? (
//                     test.final_submission ? (
//                       <Badge bg="primary">Submitted</Badge>
//                     ) : (
//                       <Badge bg="warning">Pending</Badge>
//                     )
//                   ) : (
//                     <Badge bg="danger">Not Attended</Badge>
//                   )}
//                 </td>
//                 <td>
//                   {test.has_attended && test.final_submission ? (
//                     <Link
//                       to={`weeklytest-detailed-summary/${test.test_id}`}
//                       className="btn btn-outline-info"
//                     >
//                       View
//                     </Link>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </Table>

//       <div className="d-flex align-items-center justify-content-center">
//         <Paginate
//           currentPage={currentPage}
//           totalItems={activeTests.length}
//           itemsPerPage={testsPerPage}
//           onPageChange={paginate}
//         />
//       </div>
//     </Container>
//   );
// };

// export default ActiveWeeklyTests;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Badge } from "react-bootstrap";
import { baseURL } from "../../config";
import { Link } from "react-router-dom";
import Paginate from "../../common/Paginate";

const ActiveWeeklyTests = () => {
  const [activeTests, setActiveTests] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(5);

  // Fetch token
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token provided.");

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/api/weekly-test/getStudentAndActiveTestsWithAttendance`,
          config
        );
        console.log("Fetched Data:", data);
  
        setStudentDetails(data.student);
  
        // Directly use active_tests
        const testsWithMarks = await Promise.all(
          data.active_tests.map(async (test) => {
            const response = await axios.get(
              `${baseURL}/api/weekly-test/getAllIndividualStudentResultsForTest/${test.test_id}`
            );
  
            const isAnswerDisplayed = response.data.weekly_test.isAnswerDisplayed;
            const isResultsVisible = response.data.weekly_test.isResultsVisible;
            const studentResults = response.data.student_results;
            const studentResult = studentResults.find(
              (result) => result.student_id === data.student.student_id
            );
  
            let finalSubmission = false;
            if (studentResult) {
              const submissionResponse = await axios.post(
                `${baseURL}/api/weekly-test/checkAndSubmitTest`,
                {
                  student_id: data.student.student_id,
                  wt_id: test.test_id,
                }
              );
  
              finalSubmission = submissionResponse.data.result?.final_submission || false;
            }
  
            return {
              ...test,
              has_attended: !!studentResult,
              obtained_marks: studentResult?.obtained_marks ?? null,
              total_available_marks: studentResult?.total_available_marks ?? 0,
              final_submission: finalSubmission,
              isAnswerDisplayed: isAnswerDisplayed,
              isResultsVisible: isResultsVisible,
            };
          })
        );
  
        const sortedTests = testsWithMarks.sort((a, b) => b.test_id - a.test_id);
        setActiveTests(sortedTests);
      } catch (error) {
        console.error("Error fetching active tests or student results:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTests();
  }, [token]);
  

  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = activeTests.slice(indexOfFirstTest, indexOfLastTest);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Container className="mt-4">Loading...</Container>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center">Weekly Tests</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Test Description</th>
            <th>Test Date</th>
            <th>Total Marks</th>
            <th>Obtained Marks</th>
            <th>Status</th>
            <th>Detailed Summary</th>
          </tr>
        </thead>
        <tbody>
          {currentTests.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No active weekly tests available.
              </td>
            </tr>
          ) : (
            currentTests.map((test) => (
              <tr key={test.test_id}>
                <td>
                  <a
                    href={test.test_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {test.test_description}
                  </a>
                </td>
                <td>{test.test_date}</td>
                <td>
                  {test.has_attended && test.final_submission
                    ? test.total_available_marks
                    : "N/A"}
                </td>
                <td>
                  {test.has_attended && test.final_submission && test.isResultsVisible
                    ? test.obtained_marks
                    : test.has_attended
                    ? "-"
                    : "N/A"}
                </td>
                <td>
                  {test.has_attended ? (
                    test.final_submission ? (
                      <Badge bg="primary">Submitted</Badge>
                    ) : (
                      <Badge bg="warning">Pending</Badge>
                    )
                  ) : (
                    <Badge bg="danger">Not Attended</Badge>
                  )}
                </td>
                <td>
                  {test.has_attended && test.final_submission  && test.isAnswerDisplayed? (
                    <Link
                      to={`weeklytest-detailed-summary/${test.test_id}`}
                      className="btn btn-outline-info"
                    >
                      View
                    </Link>
                  ) : (
                    "NA"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="d-flex align-items-center justify-content-center">
        <Paginate
          currentPage={currentPage}
          totalItems={activeTests.length}
          itemsPerPage={testsPerPage}
          onPageChange={paginate}
        />
      </div>
    </Container>
  );
};

export default ActiveWeeklyTests;
