import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import {baseURL}  from '../config';

const Submission = () => {
  const { questionId, batchId } = useParams();
  const [question, setQuestion] = useState({ question: '', description: '' });
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const { questionId } = useParams();
  console.log('batch id :',batchId)
  console.log('question id :',questionId)

  useEffect(() => {
    const fetchQuestionById = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token provided.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          `${baseURL}/api/student/getQuestionById`,
          { id: questionId },
          config
        );

        setQuestion(response.data);
      } catch (error) {
        console.error('Failed to fetch question:', error);
      }
    };

    fetchQuestionById();
  }, [questionId]);

  const executeCode = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token provided.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      setLoading(true);
      const response = await axios.post(`${baseURL}/api/student/executeJavaCodeHandler`, {
        code: code, // Send the Java code
      }, config);

      setOutput(response.data.output); // Set the output directly from the response
    } catch (error) {
      console.error('Error executing Java code:', error);
      if (error.response && error.response.data) {
        console.error('Error message from server:', error.response.data);
      }
      setOutput('Error executing Java code');
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token provided.");
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      setLoading(true);
      const response = await axios.post(`${baseURL}/api/student/saveStudentSubmission`, {
        question_id: questionId,
        code: code,
        batch_id: batchId,
        submission_time: new Date().toISOString(),
        no_testcase_passed: 0, 
        execution_output: output,
      }, config);
  
      toast.success('Successfully submitted the code');
    } catch (error) {
      console.error('Error submitting code:', error);
      if (error.response && error.response.status === 400) {
        toast.warn('You have already submitted the answer for this question.');
      } else {
        toast.error('Error submitting the code');
      }
    } finally {
      setLoading(false);
      handleCloseModal(); // Close the modal regardless of success or failure
    }
  };
  

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <div className="container mt-5">
      <h2>Submit Answer</h2>
      <div className="mb-4">
        <h4>{question.question}</h4>
        <p>{question.description}</p>
      </div>
      <div className="mb-4">
        <h5>Write your code in the below editor</h5>
        <textarea
          className="form-control bg-dark text-light"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          placeholder="Write your Java code here"
          style={{ color: '#fff', '::placeholder': { color: '#fff' } }} // Add custom styles for placeholder text
        ></textarea>
      </div>
      <div className="mb-4">
        <button className="btn btn-primary mr-2" onClick={executeCode} disabled={loading}>Run</button>
        <Button className="btn btn-success m-4 " onClick={handleShowModal} disabled={loading}>
          Submit Code
        </Button>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <b>Note:</b> Befor Submitting Run the code. <br />
            And you can submit answer for this question only once.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="success" onClick={submitCode} disabled={loading}>
              Confirm Submission
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {loading && <div>Compiling...</div>}
      <div className="mb-4">
        <h4>Output:</h4>
        <pre className="bg-dark text-light p-3">{output}</pre>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Submission;
