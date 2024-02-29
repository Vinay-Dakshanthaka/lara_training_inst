import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Course = () => {
  return (
    <>
    <Container className="mt-5">
      <h2 className="text-center">JAVA FULLSTACK DEVELOPMENT COURSE</h2>
      <Card className="shadow mt-4">
        <Card.Body>
          
          <Row className="mb-3">
            <Col sm={4}>
              <h6>Duration : 6 months</h6>
            </Col>
            <Col sm={4}>
              <h6>Course Hours : 1000</h6>
            </Col>
            <Col sm={4}>
              <h6>Prerequisites : No Prerequisites</h6>
            </Col>
          </Row>


          <h4 className='text-center'>Description:</h4>
          <p>This comprehensive Java Fullstack Development course is designed to equip you with the skills and knowledge needed to become a proficient fullstack developer using Java technologies.</p>

          <h4 className='text-center text-decoration-underline'>Course Content:</h4>
          <Row >
            <Col sm={6}>
              <h5>Back-End Technologies:</h5>
              <ul>
                <li>CORE JAVA</li>
                <li>SQL</li>
                <li>SPRING</li>
                <li>SPRING BOOT</li>
                <li>REST WEBSERVICES</li>
                <li>SPRING MICROSERVICES</li>
                <li>SPRING SECURITY</li>
              </ul>
            </Col>
            <Col sm={6}>
              <h5>Front-End Technologies:</h5>
              <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JAVASCRIPT</li>
                <li>BOOTSTRAP</li>
                <li>TYPESCRIPT</li>
                <li>ANGULAR</li>
                <li>REACT</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className="shadow mt-4">
        <Card.Body>
          <h2 className="text-center">Other Required Technologies</h2>
          <Row className="mt-4">
            <Col md={6}>
              <h4>Logical Coding</h4>
              <ul>
                <li>Data Structures</li>
                <li>Algorithms</li>
                <li>Design Patterns</li>
                <li>LeetCode and HackerRank Problems</li>
              </ul>
            </Col>
            <Col md={6}>
              <h4>Additional Skills</h4>
              <ul>
                <li>Git</li>
                <li>Aptitude</li>
                <li>Reasoning</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className="shadow mt-4">
        <Card.Body>
          <h2 className="text-center">Soft Skills</h2>
          <Row className="mt-4">
            <Col md={6}>
              <ul>
                <li>Communication</li>
                <li>Personality Development</li>
              </ul>
            </Col>
            <Col md={6}>
              <ul>
                <li>Spoken English</li>
                <li>Resume Building</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
    <Container className="mt-5 mb-4">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">INTERNSHIP</h2>
          <h4>ITS A LIVE PROJECT BY USING SPRINGBOOT AND ANGULAR SKILLS</h4>
          <hr />
          <h3>Detailed Course Content</h3>
          <ul>
            <li>Soft Skill Classes: 2 hours daily to improve personality and become industry-ready</li>
            <li>Aptitude Classes: 2 hours daily to enhance problem-solving ability and crack interviews</li>
            <li>Technical Classes: 2 hours daily covering deep content on various technologies</li>
            <li>Internship Classes: Real-time development involvement for gaining industry knowledge</li>
          </ul>
          <h3>Who Can Join The Course?</h3>
          <p>Any Graduate Can Join The Course,There Is No Criteria Regarding Passout year, Percentage or Field Of Graduation, We Are Starting All The Technologies Right From The Scratch</p>
          <h3>What We Are Providing?</h3>
          <p>At Lara Technologies We Are Providing Deep knowledge Of 20 Skills, We Have Our Premises Which is 24 hours open for students to practice and gain knowledge, Students Have to stay in Lara environment from morning 8:30 to evening 8:30</p>
        </Card.Body>
      </Card>
    </Container>
  
    </>
  );
};

export default Course;
