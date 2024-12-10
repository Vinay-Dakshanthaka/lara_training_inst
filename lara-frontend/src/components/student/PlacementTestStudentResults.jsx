import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Card, Container, Row, Col } from "react-bootstrap";
import { baseURL } from "../config";

const PlacementTestStudentResults = ({ email }) => {
  const [studentData, setStudentData] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log("email :::", email)
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/placement-test/getPlacementTestResultsByEmail/${email}`);
        // console.log("response from fethc results :: ", response)
        // const response = await axios.get(`${baseURL}/api/placement-test/getPlacementTestResultsByEmail/vinayhari789@gmail.com`);
        const { student, testResults } = response.data;
        setStudentData(student);
        setTestResults(testResults);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [email]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-3">Student Details</Card.Title>
              <p>
                <strong>Name:</strong> {studentData.student_name}
              </p>
              <p>
                <strong>Email:</strong> {studentData.email}
              </p>
              <p>
                <strong>Phone:</strong> {studentData.phone_number}
              </p>
              <p>
                <strong>College :</strong> {studentData.college_name}
              </p>
              <p>
                <strong>University :</strong> {studentData.university_name}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h4 className="text-center mb-4">Test Results</h4>
          {testResults.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  {/* <th>Test ID</th> */}
                  <th>Test Title</th>
                  {/* <th>Start Time</th> */}
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((result, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {/* <td>{result.placement_test_id}</td> */}
                    <td>{result.PlacementTest.test_title}</td>
                    {/* <td>{new Date(result.PlacementTest.start_time).toLocaleString()}</td> */}
                    <td>{result.marks_obtained}</td>
                    <td>{result.total_marks}</td>
                    <td>{new Date(result.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">
              No test results found for this student.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PlacementTestStudentResults;
