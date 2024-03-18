import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {baseURL}  from './config';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

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
      setError('Password must contain at least 8 characters, including at least one symbol, one character, and one digit');
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

      const response = await axios.put(`${baseURL}/api/student/updatePassword`, {
        oldPassword,
        newPassword,
      }, config);

      if (response.status === 200) {
        setSuccess('Password updated successfully');
        localStorage.removeItem('token')
        setTimeout(() => {
          navigate('/login');
        }, 2000);

        // Clear form fields
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Wrong Password');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-1 col-6">
        <h3 className="mb-4 text-center">Change Password</h3>
        <Form onSubmit={handleSubmit} className="col-12">
          <div className="mb-3">
            <label htmlFor="oldPassword" className="form-label">Old Password</label>
            <div className="input-group">
              <input
                type={showOldPassword ? 'text' : 'password'}
                className="form-control"
                id="oldPassword"
                name="oldPassword"
                value={oldPassword}
                onChange={handleChange}
                required
              />
              <button className="btn btn-outline-secondary" type="button" onClick={toggleOldPasswordVisibility}>
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <div className="input-group">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="form-control"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
                required
              />
              <button className="btn btn-outline-secondary" type="button" onClick={toggleNewPasswordVisibility}>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
            <div className="input-group">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                className="form-control"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={handleChange}
                required
              />
              <button className="btn btn-outline-secondary" type="button" onClick={toggleConfirmNewPasswordVisibility}>
                {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
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
  );
};

export default ChangePassword;
