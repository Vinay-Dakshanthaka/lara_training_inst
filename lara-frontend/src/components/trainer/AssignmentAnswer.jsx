import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {baseURL}  from '../config';

const AssignmentAnswer = () => {
  const { batchId, studentId } = useParams(); // Get batchId and studentId from URL params
  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
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
        setSubmissions(submissionsResponse.data);

        const questionsPromises = submissionsResponse.data.map(submission => {
          return axios.post(
            `${baseURL}/api/student/getQuestionById`,
            { id: submission.question_id },
            config
          );
        });
        const questionsResponses = await Promise.all(questionsPromises);
        const questionsData = questionsResponses.map(response => response.data);
        setQuestions(questionsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [batchId, studentId]);

  return (
    <div className="container mt-5">
      <h2>Student Submissions</h2>
      <div className="row">
        {submissions.map((submission, index) => (
          <div key={index} className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                Submission {index + 1}
              </div>
              <div className="card-body">
                <h5 className="card-title">Question</h5>
                <p className="card-text">{questions[index]?.question}</p>
                {/* <p>{questions[index]?.discription}</p> */}
                <h5 className="card-title">Code</h5>
                <pre className="card-text bg-light p-3">{submission.code}</pre>
                <h5 className="card-title">Output</h5>
                <pre className="card-text bg-light p-3">{submission.execution_output}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentAnswer;
