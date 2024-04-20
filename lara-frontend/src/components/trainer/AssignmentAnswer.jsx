import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { baseURL } from '../config';
import BackButton from '../BackButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Accordion from 'react-bootstrap/Accordion';
import { BsArrowLeft, BsChevronDown } from 'react-icons/bs';
import { Tooltip } from '@mui/material';

const AssignmentAnswer = () => {
  const { batchId, studentId } = useParams(); // Get batchId and studentId from URL params
  const [submissions, setSubmissions] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [marks, setMarks] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionsPerPage] = useState(10);

  const getStudentDetailsById = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${baseURL}/api/student/getStudentDetailsById`,
        { id: studentId },
        config
      );

      // Destructure the response to get student and college details
      const { student, collegeDetails } = response.data;

      return { student, collegeDetails };
    } catch (error) {
      console.error('Failed to fetch student details:', error);
      return null;
    }
  };



  const fetchData = async () => {
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

      const submissionsResponse = await axios.post(
        `${baseURL}/api/student/getStudentSubmissionsByBatchId`,
        { batchId, studentId },
        config
      );

      const studentDetails = await getStudentDetailsById(studentId);
      setStudentDetails(studentDetails);
      console.log("student id ", studentId)
      console.log("student details ", studentDetails)

      // Sort submissions by date in descending order
      const sortedSubmissions = submissionsResponse.data.sort((a, b) => new Date(b.submission_time) - new Date(a.submission_time));

      setSubmissions(sortedSubmissions);

      const questionsPromises = sortedSubmissions.map(submission => {
        return axios.post(
          `${baseURL}/api/student/getQuestionById`,
          { id: submission.question_id },
          config
        );
      });
      const questionsResponses = await Promise.all(questionsPromises);
      const questionsData = questionsResponses.map(response => response.data);
      setQuestions(questionsData);
      // Initialize marks array with default marks for each submission
      setMarks(sortedSubmissions.map(() => 0));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [batchId, studentId]);

  const handleMarkChange = (index, event) => {
    const newMarks = [...marks];
    newMarks[index] = parseInt(event.target.value);
    setMarks(newMarks);
  };

  const assignMarks = async (index) => {
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

      const submission = submissions[index];
      const { question_id } = submission;
      const marksToAssign = marks[index];

      await axios.post(
        `${baseURL}/api/student/saveStudentMarks`,
        { student_id: studentId, question_id, batch_id: batchId, marks: marksToAssign },
        config
      );

      toast.success("Marks Assigned Successfully");
      fetchData();

    } catch (error) {
      console.error('Failed to assign marks:', error);
      toast.error("Something went wrong");
    }
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Pagination
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <BackButton />
      {/* <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: '9999' }}>
      <Link to="/assignment-answer" className="btn btn-primary">
        <BsArrowLeft style={{ fontSize: '24px' }} /> Back to Assignment Answer
      </Link>
    </div> */}
      {/* <h2>{studentDetails.name}'s Assignment Submissions</h2> */}
      {/* <p className='h4'>Name : {studentDetails.name}</p> */}
      {studentDetails && studentDetails.student ? (
        <>
          <h2> Assignment Submissions</h2>
          <p className='h4'>Name :{studentDetails.student.name}</p>
          <p className='h4'>Email : {studentDetails.student.email}</p>
          <p className='h4'>College: {studentDetails.collegeDetails ? studentDetails.collegeDetails.college_name : 'Not Available'}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <Accordion defaultActiveKey={null}>
        {currentSubmissions.map((submission, index) => (
          <Accordion.Item key={index} eventKey={index} >
            <Accordion.Header onClick={() => toggleAccordion(index)}>
              Question - {questions[indexOfFirstSubmission + index]?.id} - {questions[indexOfFirstSubmission + index]?.question}
              {submission.marks === null || submission.marks === 0 ? <Tooltip title="Not Evaluvated"><span className="float-end badge badge-danger m-2 bg-warning" >!</span></Tooltip> : null}
              {/* <br />
                <small> {new Date(submission.submission_time).toLocaleString()}</small> */}
              {/* <BsChevronDown className={`accordion-icon ${openAccordion === index ? 'open' : ''}`} /> */}
            </Accordion.Header>
            <Accordion.Body>
              <p><b>Submitted on -</b> {new Date(submission.submission_time).toLocaleString()}</p>
              <p><b>Question - </b>{questions[indexOfFirstSubmission + index]?.question}</p>
              <pre><b>Description:</b> {questions[indexOfFirstSubmission + index]?.description}</pre>
              <h5>Code</h5>
              <pre className="bg-light p-3">{submission.code}</pre>
              <h5>Output</h5>
              <pre className="bg-light p-3">{submission.execution_output}</pre>
              <h4>Marks : {submission.marks}</h4>
              {submission.marks === null || submission.marks === 0 ?
                <div className="form-group">
                  <label htmlFor={`marks${index}`}>Assign Marks:</label>
                  <input
                    type="number"
                    className="form-control"
                    id={`marks${index}`}
                    value={marks[indexOfFirstSubmission + index]}
                    onChange={(event) => handleMarkChange(indexOfFirstSubmission + index, event)}
                  />
                  <button className="btn btn-primary mt-2" onClick={() => assignMarks(indexOfFirstSubmission + index)}>
                    Assign Marks
                  </button>
                </div>
                : null
              }
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <nav>
        <ul className='pagination'>
          {Array.from({ length: Math.ceil(submissions.length / submissionsPerPage) }).map((_, index) => (
            <li key={index} className='page-item'>
              <button onClick={() => paginate(index + 1)} className='page-link'>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AssignmentAnswer;
