import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import logo from '../resources/images/laralogo.webp';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './footer.css'

const Footer = () => {
  const navigate = useNavigate();

  const handleNavLinkClick = (page) => {
    switch (page) {
      case 'HOME':
        navigate('/');
        break;
      case 'ABOUT':
        navigate('/about');
        break;
      case 'COURSE':
        navigate('/course');
        break;
      default:
        break;
    }
  };

  const location = useLocation();
  
      // Hide the Navbar on '/join-channel'
      if (location.pathname === "/join-channel") {
        return null;
      }

  return (
    <footer className="bg-footer text-light py-5">
      <Container>
        <Row className="mb-4">
          {/* About Us */}
          <Col md={4} className="mb-4">
            <h5 className="text-white">About Us</h5>
            <img src={logo} alt="Lara Technologies" className="mb-3 bg-white rounded p-1" style={{ maxWidth: '150px' }} />
            <p className="text-light">Lara Technologies is the best place to start your career since 2005.</p>
          </Col>

          {/* Navigation Links */}
          <Col md={4} className="mb-4">
            <h5 className="text-white">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light" onClick={() => handleNavLinkClick('HOME')}>Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-light" onClick={() => handleNavLinkClick('ABOUT')}>About</Link>
              </li>
              <li>
                <Link to="/course" className="text-light" onClick={() => handleNavLinkClick('COURSE')}>Course</Link>
              </li>
            </ul>
          </Col>

          {/* Stay Connected */}
          <Col md={4} className="mb-4">
            <h5 className="text-white">Stay Connected</h5>
            <p>Follow us on social media for updates and news:</p>
            <div className="d-flex">
              <a href="https://www.facebook.com/laratechnologiesforjava" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaFacebook size={30} />
              </a>
              <a href="https://twitter.com/Laratech2" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaTwitter size={30} />
              </a>
              <a href="https://www.linkedin.com/company/lara-technologies-pvt-ltd/about/" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaLinkedin size={30} />
              </a>
              <a href="https://www.instagram.com/lara_technologies/" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaInstagram size={30} />
              </a>
              <a href="https://www.youtube.com/@Faang-academy" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaYoutube size={30} />
              </a>
            </div>
          </Col>
        </Row>

        {/* Contact Us */}
        <Row className="mb-4">
          <Col className="text-center">
            <h5 className="text-white">Contact Us</h5>
            <p>Email: <a href="mailto:support@lara.co.in" className="text-light">support@lara.co.in</a></p>
            <p>Phone: +91 7975938871</p>
          </Col>
        </Row>

        {/* Copyright */}
        <Row>
          <Col className="text-center">
            <p className="mb-0">© 2024 Laratechnology. All rights reserved. | 
              <Link to="terms" className="text-light"> Terms & Conditions</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
