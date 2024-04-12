import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { baseURL } from '../config';

const Answers = () => {
  const [studentDetails, setStudentDetails] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const { studentId } = useParams();

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
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, [studentId]);

  return (
    <div className="row">
      <div className="col">
        <h1>Assignment Answers</h1>
        {studentDetails ? (
          <div>
            <h2>Student Name : {studentDetails.name}</h2>
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {submissions.map((submission, index) => (
                <div key={index} className="col-md-6">
                  <div className={`card mb-4 ${submission.submission.marks !== null && submission.submission.marks !== 0 ? 'border-success' : ''}`}>
                    <div className={`card-header ${submission.submission.marks !== null && submission.submission.marks !== 0 ? 'bg-success text-white' : ''}`}>
                      <p>Batch: {submission.batch.batch_name}</p>
                      <p>Submitted on: {new Date(submission.submission.submission_time).toLocaleString()}</p>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{submission.question.question}</h5>
                      <p className="card-text">{submission.question.description}</p>
                      <pre className='card-text bg-light p-3'>{submission.submission.code}</pre>
                      <pre className="card-text bg-light p-3">Output: {submission.submission.execution_output}</pre>
                      <h4 className='card-text'>Marks: {submission.submission.marks}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No Submissions</p>
        )}
      </div>
    </div>
  );
};

export default Answers;
