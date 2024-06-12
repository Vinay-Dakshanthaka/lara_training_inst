import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import { baseURL } from '../config';
import BackButton from '../BackButton';

const Submission = () => {
  const initialCode = `public class Solution {
    public static void main(String[] args) {
        // Write your code here
    }
}`;
  const { questionId, batchId } = useParams();
  const [question, setQuestion] = useState({ question: '', description: '', image: '' }); // Added 'image' to store question image
  const [code, setCode] = useState(initialCode);
 // const textareaRef = useRef(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const textareaRef = useRef(null);
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

  // Function to fetch question image
  useEffect(() => {
    const fetchQuestionImage = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer', // Receive the image as a buffer
        };

        const response = await axios.post(
          `${baseURL}/api/student/getQuestionImage`,
          { id: questionId },
          config
        );

        // Convert the received image data to Base64
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );

        // Set the image in the question state
        setQuestion((prevQuestion) => ({
          ...prevQuestion,
          image: `data:${response.headers['content-type']};base64,${base64Image}`,
        }));
      } catch (error) {
        console.error('Error fetching question image:', error);
      }
    };

    fetchQuestionImage();
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
    if (!code.trim()) {
      toast.warn('Code should not be empty.');
      return;
    }

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

    //Moving the cursor in the main method after loading
    useEffect(() => {
      const setCursorPosition = () => {
        const mainMethodStart = initialCode.indexOf('// Write your code here');
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(mainMethodStart, mainMethodStart);
        }
      };
  
      setCursorPosition();
    }, [initialCode]);
  
    const handleTabKeyPress = (event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
  
        // Insert four spaces at the cursor's current position
        const value = code;
        const newValue = value.substring(0, start) + '    ' + value.substring(end);
        setCode(newValue);
  
        // Move the cursor to after the inserted spaces
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      }
    };
  
  return (
    <div className="container mt-5">
      <BackButton/>
      <h2>Submit Answer</h2>
      <div className="mb-4">
        <h4>{question.id} - {question.question}</h4>
        <pre>{question.description}</pre>
        {/* Display the question image if available */}
        {question.image && (
          <img
            src={question.image}
            alt="Question Image"
            style={{ maxWidth: '300px', height: '300px', marginTop: '10px' }}
          />
        )}
      </div>
      <div className="mb-4">
        <h5>Write your code in the below editor</h5>
        <textarea
          ref={textareaRef}
          className="form-control bg-light text-dark"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => handleTabKeyPress(e)}
          rows={20}
          placeholder="Write your Java code here"
          style={{ color: '#fff', '::placeholder': { color: '#fff' } }} 
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
            <b>Note:</b> Before submitting, run the code.<br />
            You can submit an answer for this question only once.
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
