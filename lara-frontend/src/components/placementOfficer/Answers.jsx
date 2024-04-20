import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { baseURL } from '../config';
import { Accordion, Pagination, Tooltip } from 'react-bootstrap';
import BackButton from '../BackButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Answers = () => {
  const [studentDetails, setStudentDetails] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [questionImages, setQuestionImages] = useState({}); // State to store question images
  const { studentId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionsPerPage] = useState(10);

  useEffect(() => {
    const fetchSubmissions = async () => {
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

        const response = await axios.post(`${baseURL}/api/student/getStudentSubmissionsByStudentId`, { studentId }, config);
        const { student, submissions } = response.data;

        // Sort submissions by submission_time in descending order
        const sortedSubmissions = submissions.sort((a, b) => new Date(b.submission.submission_time) - new Date(a.submission.submission_time));
        
        setStudentDetails(student);
        setSubmissions(sortedSubmissions);

        // Fetch question images for each submission
        const imageRequests = sortedSubmissions.map(async (submission) => {
          const image = await fetchQuestionImage(submission.question.id); // Call fetchQuestionImage with question ID
          // Store the Base64 image in state
          setQuestionImages((prevImages) => ({
            ...prevImages,
            [submission.question.id]: image,
          }));
        });

        await Promise.all(imageRequests);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, [studentId]);

  // Function to fetch question image
  const fetchQuestionImage = async (questionId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer', // Receive the image as a buffer
      };

      // Fetch the image for the specified question ID
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

      // Return the Base64 image data
      return `data:${response.headers['content-type']};base64,${base64Image}`;
    } catch (error) {
      console.error('Error fetching question image:', error);
      return null;
    }
  };

  // Pagination
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <BackButton />
      <h3>{studentDetails.name}</h3>
      <p>{studentDetails.email}</p>
      {submissions && submissions.length > 0 ? (
        <Accordion defaultActiveKey={null}>
          {currentSubmissions.map((submission, index) => (
            <Accordion.Item key={index} eventKey={index}>
              {/* Accordion Header */}
              <Accordion.Header>
                {/* Question Title */}
                <div className={`card-header ${submission.submission.marks !== null && submission.submission.marks !== 0 ? <Tooltip title="Not Evaluated"><span className="float-end badge badge-danger m-2 bg-warning" >!</span></Tooltip> : ''}`}>
                  <p><b>Batch:</b> {submission.batch.batch_name}</p>
                  <p><b>Submitted on: </b>{new Date(submission.submission.submission_time).toLocaleString()}</p>
                  <h5 className="card-title">{submission.question.id} - {submission.question.question}</h5>
                  {submission.submission.marks === null || submission.submission.marks === 0 ? (
                    <Tooltip title="Not Evaluated">
                      <span className="float-end badge badge-danger m-2 bg-warning">!</span>
                    </Tooltip>
                  ) : null}
                </div>
              </Accordion.Header>
              {/* Accordion Body */}
              <Accordion.Body>
                {/* Submission Details */}
                <div className="card-body">
                  {/* <h5 className="card-title">{submission.question.id} - {submission.question.question}</h5> */}
                  <pre className="card-text">{submission.question.description}</pre>
                  {questionImages[submission.question.id] ? (
                    <img
                      src={questionImages[submission.question.id]}
                      alt="Question Image"
                      className='responsive-image'
                      style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                    />
                  ) : (
                    <div/>
                  )}
                  <pre className="card-text bg-light p-3">{submission.submission.code}</pre>
                  <pre className="card-text bg-light p-3">Output: {submission.submission.execution_output}</pre>
                  <h4 className="card-text">Marks: {submission.submission.marks}</h4>
                 
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <p className='text-center display-6'>No Submissions</p>
      )}
      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          {Array.from({ length: Math.ceil(submissions.length / submissionsPerPage) }).map((_, index) => (
            <Pagination.Item key={index} active={index === currentPage - 1} onClick={() => paginate(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Answers;
