import React, { useState } from 'react';
import { Alert, Button, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'oldPassword') setOldPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmNewPassword') setConfirmNewPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password must match');
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must contain atleast 8 characters, including atleast one symbol, one character, and one digit');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return; // Handle case where token is not found in localStorage
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.put('http://localhost:8080/api/student/updatePassword', {
        oldPassword,
        newPassword,
      }, config);

      if (response.status === 200) {
        setSuccess('Password updated successfully');
        setTimeout(() => {
            navigate('/login')
        }, 2000);

        // Clear form fields
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Old password does not match');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-1 col-6">
        <h3 className="mb-4 text-center">Change Password</h3>
        <Form onSubmit={handleSubmit} className="col-12">
          <Form.Group controlId="oldPassword">
            <Form.Label>Old Password</Form.Label>
            <Form.Control type="password" name="oldPassword" value={oldPassword} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" name="newPassword" value={newPassword} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="confirmNewPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password" name="confirmNewPassword" value={confirmNewPassword} onChange={handleChange} required />
          </Form.Group>
          <div className="text-center m-2">
          <Button variant="primary" type="submit">
            Change Password
          </Button>
          </div>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
      </div>
    </div>
    </>
  );
};

export default ChangePassword;
