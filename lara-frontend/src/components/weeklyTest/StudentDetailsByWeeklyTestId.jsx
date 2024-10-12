import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Row, Col, Table } from "react-bootstrap";
import { baseURL } from "../config";

const StudentDetailsByWeeklyTestId = () => {
  const { wt_id, student_id } = useParams();
  const [studentDetails, setStudentDetails] = useState(null);
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    // Fetch student and test details
    axios
      .get(`${baseURL}/api/weekly-test/getStudentAndTestDetailsByStudentId/${wt_id}/${student_id}`)
      .then((response) => {
        setStudentDetails(response.data.student);
        setTestDetails(response.data.test);
      })
      .catch((error) => {
        console.error("Error fetching student and test details:", error);
      });
  }, [wt_id, student_id]);

  if (!studentDetails || !testDetails) {
    return <h5>Loading...</h5>; // Show a loading state while fetching data
  }

  return (
    <Container className="mt-5">
      <Row>
        {/* Student Details Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Student Details</Card.Header>
            <Card.Body>
              <Table bordered responsive>
                <tbody>
                  {/* <tr>
                    <th>ID</th>
                    <td>{studentDetails.student_id}</td>
                  </tr> */}
                  <tr>
                    <th>Name</th>
                    <td>{studentDetails.student_name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{studentDetails.student_email}</td>
                  </tr>
                  <tr>
                    <th>Phone Number</th>
                    <td>{studentDetails.student_phone}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Test Details Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Test Details</Card.Header>
            <Card.Body>
              <Table bordered responsive>
                <tbody>
                  {/* <tr>
                    <th>Test ID</th>
                    <td>{testDetails.test_id}</td>
                  </tr> */}
                  <tr>
                    <th>Test Link</th>
                    <td>
                      <a href={testDetails.test_link} target="_blank" rel="noopener noreferrer">
                        {testDetails.test_link}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>Test Date</th>
                    <td>{new Date(testDetails.test_date).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>{testDetails.wt_description}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDetailsByWeeklyTestId;
