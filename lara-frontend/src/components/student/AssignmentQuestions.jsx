import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { Link, useParams } from 'react-router-dom';
import BackButton from '../BackButton';

const AssignmentQuestions = () => {
  const { batch_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const [questionImages, setQuestionImages] = useState({}); // State to store question images

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
          { batch_id: batch_id },
          config
        );

        const sortedQuestions = response.data.sort((a, b) => b.id - a.id);
        setQuestions(sortedQuestions);

        // Fetch question images for each question
        const imageRequests = sortedQuestions.map(async (question) => {
          const image = await fetchQuestionImage(question.id); // Call fetchQuestionImage with question ID
          // Store the Base64 image in state
          setQuestionImages((prevImages) => ({
            ...prevImages,
            [question.id]: image,
          }));
        });

        await Promise.all(imageRequests);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchQuestionsByBatchId();
  }, [batch_id]);

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

  // Pagination Logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <BackButton />
      <h2 className='m-4'>Assignment Questions</h2>
      <ul className="list-group m-4">
        {currentQuestions.map((question, index) => (
          <li key={index} className="list-group-item">
            <div>
              <h4 style={{ fontWeight: 'bold' }}>{question.id} - {question.question}</h4>
              <pre style={{ fontWeight: 'bold' }}>{question.description}</pre>
              {/* Display the question image if available */}
              {questionImages[question.id] && (
                <img
                  src={questionImages[question.id]}
                  alt="Question Image"
                  className='responsive-image'
                  style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                />
              )}
            </div>
            <div className='d-flex justify-content-between'>
              <Link to={`/submission/${question.id}/${batch_id}`} className="btn btn-primary ">Solve</Link>
              <Link to={`/result/${question.id}/${batch_id}`} className="btn btn-warning">Result</Link>
            </div>
          </li>
        ))}
      </ul>
      <div className='container m-3'>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(questions.length / questionsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssignmentQuestions;
