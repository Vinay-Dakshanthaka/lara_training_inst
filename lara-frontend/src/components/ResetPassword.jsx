import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import axios from 'axios';
import {baseURL}  from './config';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate passwords
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must contain at least 8 characters, including at least one symbol, one character, and one digit');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    // Make API call to reset password
    try {
      const response = await axios.post(`${baseURL}/api/student/resetPassword?token=${token}`, { newPassword });
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirect to login after 2 seconds
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="mt-3 d-flex justify-content-center">
  <div className="col-6">
    <h1 className='text-center m-4'>Create New Password</h1>
    {error && <Alert variant="danger">{error}</Alert>}
    {success && <Alert variant="success">Password changed successfully.</Alert>}
    <Form onSubmit={handleSubmit}>
    <Form.Group controlId="newPassword">
        <Form.Label>New Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button
            variant="outline-secondary"
            onClick={toggleNewPasswordVisibility}
          >
            {showNewPassword ? <BsEyeSlash /> : <BsEye />}
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            variant="outline-secondary"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
          </Button>
        </InputGroup>
      </Form.Group>
      <div className='text-center mt-4 mb-4'>
        <Button variant="primary" type="submit">
            Change Password
        </Button>
      </div>
    </Form>
  </div>
</div>

  );
};

export default ResetPassword;
