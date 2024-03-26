import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../BackButton';

const AssignStudentsToCollege = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
    
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        };
      const response = await axios.post(`${baseURL}/api/student/assignStudentsToColleges`, formData,config);
      toast.success('Students assigned to placement officer successfully')
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please Try again later')
    }
  };

  return (
    <Container className='m-5'>
      <BackButton />
      <h4 className=''>Upload the Excel file</h4>
      <Form onSubmit={handleSubmit}>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Form.Group controlId="formFile" className="mb-3">
        <small className='bg-warning'><b>Note : Make sure the excel file you upload should conatin columns as "collegeName" and "email" as the column head</b></small>
        <br />
        <Form.Label>Select Excel file</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={!file}>
        Submit
      </Button>
    </Form>
    </Container>
  );
};

export default AssignStudentsToCollege;