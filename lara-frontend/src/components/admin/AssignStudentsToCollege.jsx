import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../BackButton';
import exampleExcelImage from './Example_Excel_sheet.png'; // Import the example Excel image

const AssignStudentsToCollege = () => {
  const [file, setFile] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${baseURL}/api/student/getAllCollegeDetails`, config);
        setColleges(response.data);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };
    fetchColleges();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collegeName', selectedCollege); // Append selectedCollege to formData

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

      const response = await axios.post(
        `${baseURL}/api/student/assignStudentsToColleges`,
        formData,
        config // No need to pass data separately in config
      );

      // Clear the fields after success
      setFile(null);
      setSelectedCollege('');

      toast.success('File Uploaded successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please Try again later');
    }
  };

  return (
    <Container className='my-5'>
      <BackButton />
      <h4 className=''>Upload the Excel file</h4>
      <Form onSubmit={handleSubmit}>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <small className='bg-warning my-3'><b>Note: Upload only excel sheet contianin "eamil" of students </b></small>
        <Col xs={12} md={6} className="my-3">
          <Button variant="info" onClick={handleShowModal} className="w-100">
            Example Excel sheet format to upload
          </Button>
        </Col>
        <Row className="mt-3 align-items-center">
          <Col xs={12} md={6} className="mb-3">
            <Form.Group controlId="formCollege">
              <Form.Label>Select College</Form.Label>
              <Form.Select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)}>
                <option value="">Choose...</option>
                {colleges.map(college => (
                  <option key={college.id} value={college.college_name}>{college.college_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} md={6} className="mb-3">
            <Form.Group controlId="formFile">
              <Form.Label>Select Excel file</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" disabled={!file || !selectedCollege}>
          Submit
        </Button>
      </Form>
      {/* Modal to display example Excel image */}
      <Modal show={showModal} onHide={handleCloseModal} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Example Excel Sheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={exampleExcelImage} alt="Example Excel Sheet" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>

  );
};

export default AssignStudentsToCollege;
