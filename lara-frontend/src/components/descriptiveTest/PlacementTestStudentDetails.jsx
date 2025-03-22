import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Row, Col, Table } from "react-bootstrap";
import { baseURL } from "../config";
import './PlacementTestStudentDetails.css'

const PlacementTestStudentDetails = () => {
  const { placement_test_id, placement_test_student_id } = useParams();
  const [studentDetails, setStudentDetails] = useState(null);
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    // Fetch student and test details
    axios
      .get(`${baseURL}/api/weekly-test/getPlacementTestStudentAndTestDetailsByStudentId/${placement_test_id}/${placement_test_student_id}`)
      .then((response) => {
        setStudentDetails(response.data.student);
        setTestDetails(response.data.test);
      })
      .catch((error) => {
        console.error("Error fetching student and test details:", error);
      });
  }, [placement_test_id, placement_test_student_id]);

  if (!studentDetails || !testDetails) {
    return <h5>Loading...</h5>; // Show a loading state while fetching data
  }

  return (
    <Container className="mt-5">
      <Row>
        {/* Student Details Section */}
        <Col md={6}>
          <div className="student-details-card">
            <h5 className="section-header">Student Details</h5>
            <Table bordered responsive className="details-table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{studentDetails.student_name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{studentDetails.student_email}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>

        {/* Test Details Section */}
        <Col md={6}>
          <div className="test-details-card">
            <h5 className="section-header">{testDetails.test_title}</h5>
            <Table bordered responsive className="details-table">
              <tbody>
                <tr>
                  <th>Test Description</th>
                  <td>{testDetails.description}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PlacementTestStudentDetails;
