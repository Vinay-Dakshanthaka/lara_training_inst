import React, { useState } from 'react'
import { Container, Row, Col, Card } from "react-bootstrap";
import imgSrc from "../resources/images/hero-section-img.png"
import "../resources/css/home.css"
import AboutUs from './homeComponents/AboutUs';
import Course from './homeComponents/Course';
import CompaniesCarousel from './homeComponents/Companies';
import { FaWhatsapp } from 'react-icons/fa';
const Home = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [whatsappNumber] = useState('+91797593887'); 

  const handleWhatsAppChat = () => {
    const url = `https://wa.me/${whatsappNumber}`;
    window.open(url, '_blank');
  };
  return (
    <>
    <section className="hero-section mt-3">
      <Container fluid>
        <Row className="align-items-center">
          {/* Left Column with Heading and Subtitle */}
          <Col md={6}>
            <div className="text-center text-md-start">
              <h1>Lara Technologies</h1>
              <p className='cursive-font'>Transforming lives since 2005, with a thriving community of 60,000+ alumni.</p>
            </div>
          </Col>
          {/* Right Column with Image */}
          <Col md={6}>
            <div className="text-center">
              <img src={imgSrc} alt="Lara Technologies" className="img-fluid" />
            </div>
          </Col>
        </Row>
      </Container>
      <hr />
    </section>
    <section>
      <AboutUs />
      <hr />
    </section>
    <section>
      <Container className='mb-4'>
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
      </Container>
    </section>

    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: '9999' }}>
      <button onClick={handleWhatsAppChat} style={{ backgroundColor: '#25D366', color: '#fff', borderRadius: '50%', padding: '10px', border: 'none', cursor: 'pointer' }}>
        <FaWhatsapp size={30} />
      </button>
    </div>

    {/* <Container>
    <CompaniesCarousel/>
    </Container> */}
    </>
  )
}

export default Home
