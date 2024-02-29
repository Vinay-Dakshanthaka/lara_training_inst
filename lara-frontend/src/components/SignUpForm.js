import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation for name
    if (name.length < 3) {
      setError('Name must be at least 3 characters long');
      return;
    }

    // Validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      return;
    }

    // Validation for phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    // Validation for password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain at least 8 characters, including at least one symbol, one character, and one digit');
      return;
    }

    // Validation for matching passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      // Send data to the server
      const response = await axios.post('http://localhost:8080/api/student/saveStudent', {
        name,
        email,
        phoneNumber,
        password
      });

      if (response.status === 200) {
        // Display success message
        setSuccessMessage('Account created successfully');

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      // Display error message if request fails
      if(error.code == "ERR_BAD_RESPONSE"){
        setError('Account exists with the entered Email')
      }else{
        setError('Failed to create account. Please try again.');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
    <div>
      <h2 className="text-center">Sign Up</h2>
      <Form onSubmit={handleSubmit} className="login-form bg-light rounded shadow p-4" style={{ maxWidth: '600px', width: '400px' }}>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formPhoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="text" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Form.Group>

        <div className="text-center">
        <Button variant="primary" type="submit"  className="text-center m-2 ms-auto me-auto">
          Sign Up
        </Button>
        </div>
        <div className="mt-1 text-center">
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    
      </Form>
    </div>
  </Container>
  );
};

export default SignUpForm;
