import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const PlacementTestError = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row>
        <Col md={12}>
          <Card className="text-center shadow-lg">
            <Card.Body>
              <FaExclamationTriangle size={50} className="text-danger mb-3" />
              <Card.Title className="text-danger">Malpractice Detected</Card.Title>
              <Card.Text className="mb-4">
                We have detected malpractice during your test. As a result, your test has been terminated. Please adhere to the rules and regulations in future assessments.
              </Card.Text>
              {/* <Button variant="primary" href="/home">Go to Homepage</Button> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlacementTestError;
