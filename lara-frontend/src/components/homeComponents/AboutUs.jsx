import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const AboutUs = () => {
  const [since, setSince] = useState(0);
  const [studentsTrained, setStudentsTrained] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [recruiters, setRecruiters] = useState(0);
  const [animate, setAnimate] = useState(true); // Local state to control animation

  useEffect(() => {
    if (animate) {
        animateNumber(since, 2005, setSince, 2000); // 2000 milliseconds (2 seconds) for since
        animateNumber(studentsTrained, 50000, setStudentsTrained, 3000); // 3000 milliseconds (3 seconds) for studentsTrained
        animateNumber(totalBatches, 170, setTotalBatches, 3000); // 3000 milliseconds (3 seconds) for totalBatches
        animateNumber(recruiters, 560, setRecruiters, 3000); // 3000 milliseconds (3 seconds) for recruiters
      }
      
  }, [animate]);

  const animateNumber = (start, end, setter, duration) => {
    const difference = end - start;
    const increment = difference / (duration / 30); // Divide by 30 for smooth animation over 3 seconds
    let currentValue = start;

    const interval = setInterval(() => {
      if (currentValue >= end) {
        clearInterval(interval);
      } else {
        currentValue += increment;
        if (currentValue >= end) {
          currentValue = end; // Ensure the final value is reached exactly
          clearInterval(interval);
        }
        setter(Math.ceil(currentValue)); // Round up to ensure the final value is reached
      }
    }, 30);
  };

  useEffect(() => {
    if (since === 2005 && studentsTrained === 50000 && totalBatches === 170 && recruiters === 560) {
      // All numbers have reached their target values, stop the animation
      setAnimate(false);
    }
  }, [since, studentsTrained, totalBatches, recruiters]);

  return (
    <>
    <Container fluid className="mt-5">
      <Row className="justify-content-center">
        <Col md={3} sm={6} xs={12} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="display-5 fw-bold">{since}</Card.Title>
              <Card.Text>Since</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="display-5 fw-bold">{studentsTrained}+</Card.Title>
              <Card.Text>Students Trained</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="display-5 fw-bold">{totalBatches}+</Card.Title>
              <Card.Text>Total Batches</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="display-5 fw-bold">{recruiters}+</Card.Title>
              <Card.Text>Recruiters</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

    <Container>
    <h2 className="text-center mb-4">About Lara Technologies</h2>
    <h5 className="text-center mb-4">Its not just an Institute... Its not just a placement agency...</h5>
    <h5 className="text-center mb-4">Its more than a University... Its more than a Company...</h5>

    <Container className="mt-5">
      <h2 className="text-center mb-5">Lara's Vision and Mission</h2>
      <Row xs={1} md={2} className="g-4">
        <Col>
          <Card className="h-100 shadow-sm" style={{ backgroundColor: "#9cc3b2" }}>
            <Card.Body>
              <Card.Title className="text-center">Coaching Excellence, Building Futures</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100 shadow-sm" style={{ backgroundColor: "#9cc3b2" }}>
            <Card.Body>
              <Card.Title className="text-center">Focused Coaching, Lasting Achievements</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100 shadow-sm" style={{ backgroundColor: "#9cc3b2" }}>
            <Card.Body>
              <Card.Title className="text-center">Practical Knowledge, Real-world Impact</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100 shadow-sm" style={{ backgroundColor: "#9cc3b2" }}>
            <Card.Body>
              <Card.Title className="text-center">Striving for Excellence, Shaping Careers</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </Container>
    </>
  );
};

export default AboutUs;
