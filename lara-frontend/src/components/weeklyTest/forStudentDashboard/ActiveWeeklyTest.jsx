// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Container } from "react-bootstrap";
// import { baseURL } from "../../config";

// const ActiveWeeklyTests = () => {
//   const [activeTests, setActiveTests] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${baseURL}/api/weekly-test/getAllActiveWeeklyTests`)
//       .then((response) => {
//         setActiveTests(response.data.tests); 
//       })
//       .catch((error) => {
//         console.error("Error fetching active weekly tests:", error);
//       });
//   }, [token]);
  
//   // Paginate tests
//   const indexOfLastTest = currentPage * testsPerPage;
//   const indexOfFirstTest = indexOfLastTest - testsPerPage;
//   const currentTests = activeTests.slice(indexOfFirstTest, indexOfLastTest);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading) {
//     return <Container className="mt-4">Loading...</Container>;
//   }

//   return (
//     <Container className="mt-4">
//       <h2>Active Weekly Tests</h2>
//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>Test ID</th>
//             <th>Test Description</th>
//             <th>Test Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {activeTests.length === 0 ? (
//             <tr>
//               <td colSpan="3" className="text-center">
//                 No active weekly tests available.
//               </td>
//             </tr>
//           ) : (
//             activeTests.map((test) => (
//               <tr key={test.wt_id}>
//                 <td>{test.wt_id}</td>
//                 <td>
//                   {/* Test link */}
//                   <a href={test.wt_link} target="_blank" rel="noopener noreferrer">
//                     {test.wt_description}
//                   </a>
//                 </td>
//                 <td>{new Date(test.test_date).toLocaleDateString()}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </Table>
//     </Container>
//   );
// };

// export default ActiveWeeklyTests;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container } from "react-bootstrap";
import { baseURL } from "../../config";

const ActiveWeeklyTests = () => {
  const [activeTests, setActiveTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  useEffect(() => {
    axios
      .get(`${baseURL}/api/weekly-test/getAllActiveWeeklyTests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setActiveTests(response.data.tests);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching active weekly tests:", error);
        setLoading(false);
      });
  }, []);

  // Paginate tests
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = activeTests.slice(indexOfFirstTest, indexOfLastTest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Container className="mt-4">Loading...</Container>;
  }

  return (
    <Container className="mt-4">
      <h2>Active Weekly Tests</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Test Description</th>
            <th>Test Date</th>
          </tr>
        </thead>
        <tbody>
          {activeTests.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No active weekly tests available.
              </td>
            </tr>
          ) : (
            currentTests.map((test) => (
              <tr key={test.wt_id}>
                <td>{test.wt_id}</td>
                <td>
                  {/* Test link */}
                  <a href={test.wt_link} target="_blank" rel="noopener noreferrer">
                    {test.wt_description}
                  </a>
                </td>
                <td>{new Date(test.test_date).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ActiveWeeklyTests;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Container, Badge, Pagination } from "react-bootstrap";
// import { baseURL } from "../../config";
// import { Link } from "react-router-dom";

// const ActiveWeeklyTests = () => {
//   const [activeTests, setActiveTests] = useState([]);
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [testsPerPage] = useState(5);  // Number of tests to display per page

//   // Fetch student id from token (assuming token is stored in localStorage)
//   const token = localStorage.getItem("token");

//   if (!token) {
//     throw new Error("No token provided.");
//   }

//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   useEffect(() => {
//     axios
//       .get(`${baseURL}/api/weekly-test/getStudentAndActiveTestsWithAttendance`, config)
//       .then((response) => {
//         setStudentDetails(response.data.student);
//         console.log(response.data)
//         // Sort tests by test_id in descending order (latest first)
//         const sortedTests = response.data.active_tests.sort((a, b) => b.test_id - a.test_id);

//         setActiveTests(sortedTests);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching active tests and attendance:", error);
//         setLoading(false);
//       });
//   }, [token]);

//   // Paginate tests
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
//             {/* <th>Test ID</th> */}
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
//                 {/* <td>{test.test_id}</td> */}
//                 <td>
//                   <a href={test.test_link} target="_blank" rel="noopener noreferrer">
//                     {test.test_description}
//                   </a>
//                 </td>
//                 <td>{test.test_date}</td>
//                 <td>{test.total_available_marks}</td>
//                 <td>{test.obtained_marks}</td>

//                 <td>
//                   {/* Display attendance status */}
//                   {test.has_attended ? (
//                     <Badge variant="success">Attended</Badge>
//                   ) : (
//                     <Badge variant="danger">Not Attended</Badge>
//                   )}
//                 </td>
//                 <td>
//                   {/* Only show the 'View' button if obtained_marks is available */}
//                   {test.obtained_marks !== null ? (
//                     <Link to={`weeklytest-detailed-summary/${test.test_id}`} className="btn btn-outline-info">
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

//       {/* Pagination */}
//       <div className="d-flex align-items-center justify-content-center">
//         <Pagination>
//           {[...Array(Math.ceil(activeTests.length / testsPerPage)).keys()].map((num) => (
//             <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => paginate(num + 1)}>
//               {num + 1}
//             </Pagination.Item>
//           ))}
//         </Pagination>
//       </div>
//     </Container>
//   );
// };

// export default ActiveWeeklyTests;