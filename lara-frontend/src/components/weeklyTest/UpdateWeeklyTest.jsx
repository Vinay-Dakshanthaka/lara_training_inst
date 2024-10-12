    import React, { useState } from 'react';
    import axios from 'axios';
    import { Form, Button, Spinner, Alert } from 'react-bootstrap';
    import { baseURL } from '../config';  // Import your base URL
import { toast, ToastContainer } from 'react-toastify';

    const UpdateWeeklyTest = ({ test, onClose, onUpdate }) => {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        // Form fields
        const [is_active, setIsActive] = useState(test.is_active);
        const [test_date, setTestDate] = useState(new Date(test.test_date).toISOString().slice(0, 10));
        const [is_monitored, setIsMonitored] = useState(test.is_monitored);
        const [no_of_questions, setNoOfQuestions] = useState(test.no_of_questions);
        const [wt_description, setWtDescription] = useState(test.wt_description);

        const handleUpdate = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token provided.");
            
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
            
                const data = {
                    is_active,
                    test_date,
                    is_monitored,
                    no_of_questions,
                    wt_description,
                };
            
                const response = await axios.put(`${baseURL}/api/weekly-test/updateWeeklyTest/${test.wt_id}`, data, config);
            
                // console.log('Full response:', response);
        
                // Access the updated test from the response object, adjust if necessary
                const updatedTest = response.data.updatedTest || response.data.test || response.data;
                // console.log('Updated test:', updatedTest);
            
                if (!updatedTest || !updatedTest.wt_id) {
                    throw new Error('Invalid response structure');
                }
            
                // Trigger the callback to update the test in the list
                onUpdate(updatedTest); 
            
                // alert('Test updated successfully');
                toast.success('Test Updated Successfully!!');
                
                setTimeout(() => {
                    onClose();  
                }, 2000);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        
        

        return (
            <>
                {loading && <Spinner animation="border" />}
                {error && <Alert variant="danger">{error}</Alert>}
                <ToastContainer />
                <Form>
                    <Form.Group controlId="isActive">
                        <Form.Label>Is Active</Form.Label>
                        <Form.Check
                            type="checkbox"
                            label="Active"
                            checked={is_active}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </Form.Group>

                    <Form.Group controlId="testDate" className="mt-3">
                        <Form.Label>Test Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={test_date}
                            onChange={(e) => setTestDate(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="noOfQuestions" className="mt-3">
                        <Form.Label>Number of Questions</Form.Label>
                        <Form.Control
                            type="number"
                            value={no_of_questions}
                            onChange={(e) => setNoOfQuestions(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="isMonitored" className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Is Monitored"
                            checked={is_monitored}
                            onChange={(e) => setIsMonitored(e.target.checked)}
                        />
                    </Form.Group>

                    <Form.Group controlId="wtDescription" className="mt-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={wt_description}
                            onChange={(e) => setWtDescription(e.target.value)}
                            placeholder="Enter test description"
                        />
                    </Form.Group>

                    <Button variant="primary" className="mt-3" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Form>
            </>
        );
    };

    export default UpdateWeeklyTest;
