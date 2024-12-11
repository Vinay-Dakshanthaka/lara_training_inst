import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import PlacementTestStudentResults from "./student/PlacementTestStudentResults";

const ExternalStudentsResults = () => {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple email validation
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmittedEmail(email); // Set the email to be passed to the child component
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-3">Enter you email to view your previous results</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  {/* <Form.Label>Email Address</Form.Label> */}
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

      {submittedEmail && (
        <Row className="mt-4">
          <Col>
            <PlacementTestStudentResults email={submittedEmail} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ExternalStudentsResults;
