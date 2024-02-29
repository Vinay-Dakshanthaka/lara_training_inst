import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const AboutUsPage = () => {
  return (
    <>
        
    <Container>
    <h2 className="text-center mb-4">About Lara Technologies</h2>
    <h4 className="text-center mb-4">Its not just an Institute... Its not just a placement agency...</h4>
    <h4 className="text-center mb-4">Its more than a University... Its more than a Company...</h4>

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

    <div className="container mt-5" >
      <h2 className="text-center mb-4">Four Pillars to Every Learner</h2>
      <div className="row">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ backgroundColor: "#adacfe" }}>
            <div className="card-body">
              <h4 className="card-title text-center">Technical Skills</h4>
              <p className="card-text">
                Develop proficiency in programming languages, tools, and technologies relevant to your field of study or career path.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ backgroundColor: "#adacfe" }}>
            <div className="card-body">
              <h4 className="card-title text-center">Aptitude and Reasoning</h4>
              <p className="card-text">
                Enhance problem-solving abilities, logical reasoning, and critical thinking skills to tackle challenges effectively.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ backgroundColor: "#adacfe" }}>
            <div className="card-body">
              <h4 className="card-title text-center">Soft Skills</h4>
              <p className="card-text">
                Develop communication, teamwork, leadership, and time management skills to excel in both professional and personal life.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ backgroundColor: "#adacfe" }}>
            <div className="card-body">
              <h4 className="card-title text-center">Internship</h4>
              <p className="card-text">
                Gain practical experience and exposure by working on real-world projects through internships and industry collaborations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Container>
    </>
  )
}

export default AboutUsPage
