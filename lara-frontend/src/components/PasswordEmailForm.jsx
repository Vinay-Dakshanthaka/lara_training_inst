import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Form } from 'react-bootstrap';
import {baseURL}  from './config';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');
    const [loading, setLoading] = useState(false); // Loading state added

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submitting form
        try {
            const response = await axios.post(`${baseURL}/api/student/sendPasswordResetEmail`, { email });
            if (response.status === 200) {
                setMessage('Password reset email link sent successfully to your email. Please check.');
                setAlertVariant('success');
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setMessage('No account exists with this email ID.');
                setAlertVariant('danger');
            } else {
                setMessage('Something went wrong.');
                setAlertVariant('danger');
            }
        } finally {
            setLoading(false); // Set loading back to false after request completes
        }
    };

    return (
        <div className="mt-3 col-12 d-flex justify-content-center">
            <div className="col-md-6 mt-4 mb-4">
                <h1 className="text-center">Enter Your Email</h1>
                {message && <Alert variant={alertVariant}>{message}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <div className="text-center mt-4 mb-4">
                        <Button variant="primary" type="submit" disabled={loading}> {/* Disable button when loading */}
                            {loading ? 'Sending...' : 'Send Email'} {/* Change button text based on loading state */}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default PasswordResetForm;
