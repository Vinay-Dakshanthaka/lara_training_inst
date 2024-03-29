import React, { useState } from 'react';
import { Form, Button, Container, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash, BsEnvelope, BsPhone } from 'react-icons/bs';
import axios from 'axios';
import { baseURL } from './config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for name
    if (name.length < 3) {
      toast.error('Name must be at least 3 characters long');
      return;
    }

    // Validation for email
    if (!emailRegex.test(email)) {
      toast.error('Invalid email address');
      return;
    }

    // Validation for phone number
    if (!phoneRegex.test(phoneNumber)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    // Validation for password
    if (!passwordRegex.test(password)) {
      toast.error('Password must contain at least 8 characters, including at least one symbol, one character, and one digit');
      return;
    }

    // Validation for matching passwords
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/api/student/saveStudent`, {
        name,
        email,
        phoneNumber,
        password
      });

      if (response.status === 200) {
        toast.success('Account created successfully');
        setTimeout(() => {
          setName('');
          setEmail('');
          setPhoneNumber('');
          setPassword('');
          setConfirmPassword('');
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.code === 'ERR_BAD_RESPONSE') {
        toast.error('Account exists with the entered Email');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    }
  };

  return (
    <Container className="my-5">
      <ToastContainer />
      <div>
        <h2 className="text-center">Create Account</h2>
        <Form onSubmit={handleSubmit} className="login-form bg-light rounded shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            {name.length > 0 && name.length < 3 && <span className="text-danger">Name must be at least 3 characters long</span>}
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsEnvelope /></InputGroup.Text>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </InputGroup>
            {email.length > 0 && !emailRegex.test(email) && <span className="text-danger">Invalid email address</span>}
          </Form.Group>

          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsPhone /></InputGroup.Text>
              <Form.Control type="text" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </InputGroup>
            {phoneNumber.length > 0 && !phoneRegex.test(phoneNumber) && <span className="text-danger">Phone number must be exactly 10 digits</span>}
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </Button>
            </InputGroup>
            {password.length > 0 && !passwordRegex.test(password) && <span className="text-danger">Password must contain at least 8 characters, including at least one symbol, one character, and one digit</span>}
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
              <Form.Control type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <Button variant="outline-secondary" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
              </Button>
            </InputGroup>
            {confirmPassword.length > 0 && password !== confirmPassword && <span className="text-danger">Passwords do not match</span>}
          </Form.Group>

          <div className="text-center row my-2">
            <Button variant="primary" type="submit" className="text-center m-2">Sign Up</Button>
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
