import React, { useState } from 'react';
import { Container, Form, Button, InputGroup, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from './config';

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber && !email) {
      toast.error('Please enter either phone number or email');
      return;
    }

    try {
      let response;
      if (email && isValidEmail(email)) {
        response = await axios.post(`${baseURL}/api/student/verifyByEmailAndPassword`, {
          email,
          password
        });
      } else {
        response = await axios.post(`${baseURL}/api/student/verifyByPhoneAndPassword`, {
          phoneNumber,
          password
        });
      }

      if (response && response.status === 200) {
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        // Redirect based on role
        if (role === 'STUDENT') {
          toast.success('Login successful. Redirecting...');
          setTimeout(() => {
            navigate('/studentHome');
            window.location.reload();
          }, 2000);
        } else if (role === 'ADMIN') {
          toast.success('Login successful. Redirecting...');
          setTimeout(() => {
            navigate('/adminDashboard');
            window.location.reload();
          }, 2000);
        } else if (role === 'SUPER ADMIN') {
          toast.success('Login successful. Redirecting...');
          setTimeout(() => {
            navigate('/superAdminDashboard');
            window.location.reload();
          }, 2000);
        } else if (role === 'TRAINER') {
          toast.success('Login successful. Redirecting...');
          setTimeout(() => {
            navigate('/trainerDashboard');
            window.location.reload();
          }, 2000);
        }else if (role === 'PLACEMENT OFFICER') {
            toast.success('Login successful. Redirecting...');
            setTimeout(() => {
              navigate('/placementOfficerDashboard');
              window.location.reload();
            }, 2000);
        }else if (role === 'RECRUITER') {
            toast.success('Login successful. Redirecting...');
            setTimeout(() => {
              navigate('/recruiterDashboard');
              window.location.reload();
            }, 2000);
        } else {
          toast.error("Oops!! Something went wrong. Please try to login again");
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to login. Please check your credentials.');
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Container className='my-5'>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={6}>
          <div className="login-form bg-light rounded shadow p-4">
            <h2 className="text-center mb-4">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formPhoneNumber" className="mb-3">
                <Form.Label>Phone Number / Email</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number or email"
                    value={phoneNumber || email}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setEmail(e.target.value);
                    }}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3">
                Login
              </Button>
              <div className="text-center mb-3">
                Forgot Password? <Link to="/passwodResetForm">Click Here</Link>
              </div>
            </Form>
            <div className="text-center">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </div>
        </Col>
      </Row>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default LoginForm;
