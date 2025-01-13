import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../config";

const UpdateStudentEmail = () => {
  const [email, setEmail] = useState(""); // The email entered to fetch student details
  const [studentData, setStudentData] = useState(null); // To store fetched student data
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [newEmail, setNewEmail] = useState(""); // The new email to be updated
  const [error, setError] = useState(""); // For any errors encountered
  const [submittedEmail, setSubmittedEmail] = useState(""); // To store the submitted email

  // Fetch student data based on the email entered
  useEffect(() => {
    if (!email) return; // Don't fetch if email is empty
    setLoading(true);

    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/placement-test/getPlacementTestResultsByEmail/${email}`);
        setStudentData(response.data.student); // Store student data
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [email]);

  // Handle email submission for fetching student data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(""); // Clear any previous errors
    setSubmittedEmail(email); // Set the submitted email
  };

  // Handle the new email submission for updating
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!newEmail || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmail)) {
      setError("Please enter a valid new email address.");
      return;
    }

    try {
      // Make an API call to update the email
      const response = await axios.put(`${baseURL}/api/placement-test/updateEmail/${studentData.email}`, {
        newEmail
      });

      // On successful email update
      setStudentData({ ...studentData, email: newEmail }); // Update the email in student data
      setNewEmail(""); // Reset the new email field
      setError(""); // Clear any errors
      alert("Email updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while updating the email.");
    }
  };

  return (
    <Container className="mt-4">
      {/* Form to enter email for fetching student details */}
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-3">Enter Email to View Student Data</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Control
                    type="email"
                    placeholder="Enter student email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
                <Button type="submit" variant="primary" className="mt-3 w-100">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Display student details and provide update option */}
      {studentData && !loading && (
        <Row className="mt-4">
          <Col md={8} className="mx-auto">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-center mb-3">Student Details</Card.Title>
                <Row>
                  <Col md={8}>
                    <p><strong>Name:</strong> {studentData.student_name}</p>
                    <p><strong>Email:</strong> {studentData.email}</p>
                  </Col>
                  <Col md={4}>
                    <Form onSubmit={handleEmailUpdate}>
                      <Form.Group controlId="newEmail">
                        <Form.Control
                          type="email"
                          placeholder="Enter new email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                      </Form.Group>
                      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
                      <Button type="submit" variant="primary" className="mt-3 w-100">
                        Update Email
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default UpdateStudentEmail;
