import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {baseURL}  from '../config';
import { Link, useParams } from 'react-router-dom'; // Import useParams hook

const AssignmentQuestions = () => {
  const { batch_id } = useParams(); // Get batch_id from URL params
  const [questions, setQuestions] = useState([]);
  console.log("batch id", batch_id)

  useEffect(() => {
    const fetchQuestionsByBatchId = async () => {
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
          `${baseURL}/api/student/getQuestionsByBatchId`,
          { batch_id: batch_id }, // Use batch_id from URL params
          config
        );

        setQuestions(response.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchQuestionsByBatchId();
  }, [batch_id]);

  return (
    <div>
    <h2 className='m-4'>Assignment Questions</h2>
    <ul className="list-group m-4">
      {questions.map((question, index) => (
        <li key={index} className="list-group-item">
          <div>
            <h4 style={{ fontWeight: 'bold' }}>{question.question}</h4>
            <p>{question.description}</p>
            {/* <Link to={`/submission/${question.id}`} className="btn btn-primary">Solve</Link> */}
            <Link to={`/submission/${question.id}/${batch_id}`} className="btn btn-primary">Solve</Link>
          </div>
        </li>
      ))}
    </ul>
  </div>
  
  );
};

export default AssignmentQuestions;
