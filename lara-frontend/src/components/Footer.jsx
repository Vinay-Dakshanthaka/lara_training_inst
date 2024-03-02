  import React from 'react';
  import { Container, Row, Col } from 'react-bootstrap';
  import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
  import logo from '../resources/images/laralogo.webp';
  import { Link, useNavigate } from 'react-router-dom';

  const Footer = () => {
    return (
      <footer className="bg-dark text-light py-5">
        <Container>
          <Row>
            {/* About Us */}
            <Col md={4} className="mb-4">
              <h5>About Us</h5>
              <img src={logo} alt="Lara Technologies" className="mb-3" style={{ maxWidth: '150px' }} />
              <p>Lara Technologies is the best place to start your career since 2005.</p>
            </Col>

            {/* Contact Us */}
            <Col md={4} className="mb-4">
              <h5>Contact Us</h5>
              <p>Feel free to get in touch with us:</p>
              <p>Email: 
                  <a href="mailto:support@lara.co.in" className="text-light me-3">support@lara.co.in</a>
              </p>
              <p>Phone: +91 7975938871</p>
            </Col>

            {/* Stay Connected */}
            <Col md={4} className="mb-4">
              <h5>Stay Connected</h5>
              <p>Follow us on social media for updates and news:</p>
              <div className="d-flex">
              <a href="https://www.facebook.com/laratechnologiesforjava" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                  <FaFacebook size={30} />
                </a>
                <a href="https://twitter.com/Laratech2" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaTwitter size={30} />
                </a>
                <a href="https://www.linkedin.com/company/lara-technologies-pvt-ltd/about/" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaLinkedin className="me-3" size={30} />
                </a>
                <a href="https://www.instagram.com/lara_technologies/" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaInstagram className="me-3" size={30} />
                </a><a href="https://www.youtube.com/@Faang-academy" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaYoutube className="me-3" size={30} />
                </a>
              </div>
            </Col>
          </Row>

          {/* Copyright */}
          <Row>
            <Col className="text-center">
              <p className="mb-0">© 2024 Laratechnology. All rights reserved. |    
                  <Link to='terms' style={{ textDecoration: 'none', cursor: 'pointer' }}>Terms & Conditions</Link>
            </p>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  };

  export default Footer;
