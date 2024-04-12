import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { baseURL } from '../config';
import BackButton from '../BackButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignmentAnswer = () => {
  const { batchId, studentId } = useParams(); // Get batchId and studentId from URL params
  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [marks, setMarks] = useState([]);

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
      // Optionally, you may want to update UI to reflect successful assignment
      // For example, you can display a success message or change the style of the submission card
      
    } catch (error) {
      console.error('Failed to assign marks:', error);
      toast.error("Something went wrong")
      // Optionally, handle error and provide feedback to the user
    }
  };

  return (
    <div className="container mt-5">
      <BackButton />
      <h2>Student Submissions</h2>
      <div className="row">
        {submissions.map((submission, index) => (
          <div key={index} className="col-md-6">
            <div className={`card mb-4 ${submission.marks !== null && submission.marks !== 0 ? 'border-success' : ''}`}>
              <div className={`card-header ${submission.marks !== null && submission.marks !== 0 ? 'bg-success text-white' : ''}`}>
                Submitted on - {new Date(submission.submission_time).toLocaleString()}
              </div>
              <div className="card-body">
                <h5 className="card-title">Question</h5>
                <p className="card-text">{questions[index]?.question}</p>
                <h5 className="card-title">Code</h5>
                <pre className="card-text bg-light p-3">{submission.code}</pre>
                <h5 className="card-title">Output</h5>
                <pre className="card-text bg-light p-3">{submission.execution_output}</pre>
                <h4 className='card-text'>Marks : {submission.marks}</h4>
                <div className="form-group">
                  <label htmlFor={`marks${index}`}>Marks:</label>
                  <input
                    type="number"
                    className="form-control"
                    id={`marks${index}`}
                    value={marks[index]}
                    onChange={(event) => handleMarkChange(index, event)}
                  />
                </div>
                <button className="btn btn-primary" onClick={() => assignMarks(index)}>
                  Assign Marks
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AssignmentAnswer;
