import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { baseURL } from '../config';
import BackButton from '../BackButton';
import 'react-toastify/dist/ReactToastify.css';

const Result = () => {
  const { batchId, questionId } = useParams(); // Get batchId and questionId from URL params
  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [solution, setSolution] = useState(null);
  const [questionImages, setQuestionImages] = useState({});

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

        // Fetch submissions
        const submissionsResponse = await axios.post(
          `${baseURL}/api/student/getSResults`,
          { batch_id: batchId, question_id: questionId },
          config
        );
        setSubmissions(submissionsResponse.data);

        // Fetch question for each submission
        const questionPromises = submissionsResponse.data.map(submission => {
          return axios.post(
            `${baseURL}/api/student/getQuestionById`,
            { id: submission.question_id },
            config
          );
        });
        const questionResponses = await Promise.all(questionPromises);
        const questionData = questionResponses.map(response => response.data);
        setQuestions(questionData);

        // Fetch question images
        const imagePromises = questionData.map(question => fetchQuestionImage(question.id));
        const imageResponses = await Promise.all(imagePromises);
        const imageMap = {};
        questionData.forEach((question, index) => {
          imageMap[question.id] = imageResponses[index];
        });
        setQuestionImages(imageMap);

        // Fetch solution
        const solutionResponse = await axios.post(
          `${baseURL}/api/student/getQuestionById`,
          { id: questionId },
          config
        );
        setSolution(solutionResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [batchId, questionId]);

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

  return (
    <div className="container my-5">
      <BackButton />
      <h2>Result</h2>
      <div className="row">
        <div className="col-md-6">
          {submissions && submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <div key={index} className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Question</h5>
                  <p className="card-text">{questions[index]?.question}</p> {/* Display question */}
                  <h5 className="card-title">Description</h5>
                  <pre className="card-text">{questions[index]?.description}</pre> {/* Display description */}
                  <h5 className="card-title">Question Image</h5>
                  <img
                    src={questionImages[questions[index]?.id] || ' '}
                    alt="Question Image"
                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                  />
                  <h5 className="card-title">Code</h5>
                  <pre className="card-text bg-light p-3">{submission.code || 'Submit your answer to see the results'}</pre>
                  <h5 className="card-title">Output</h5>
                  <pre className="card-text bg-light p-3">{submission.execution_output || ' '}</pre>
                  <h4 className='card-text'>Marks : {submission.marks || 'Your answer is yet to be evaluated'}</h4>
                  <h6 className='card-text'>
                    Trainer's comment - {submission.comment ? (
                      <pre className="bg-light p-3">{submission.comment}</pre>
                    ) : (
                      <span>N/A</span>
                    )}
                  </h6>
                </div>
              </div>
            ))
          ) : (
            <div className="card mb-4">
              <div className="card-body">
                <p className="card-text text-center">Submit your answer to see the results</p>
              </div>
            </div>
          )}
        </div>
        {/* Solution Column */}
        <div className="col-md-6">
          {solution && solution.question ? (
            <div className="card mb-4">
              <h3 className='text-center'>Trainer's Solution</h3>
              <div className="card-body">
                {/* <h5 className="card-title">Question</h5>
                <p className="card-text">{solution.question}</p>
                <h5 className="card-title">Description</h5> */}
                {/* <pre className="card-text">{solution.description}</pre> */}
                <h5 className="card-title">Solution</h5>
                <pre className="card-text bg-light p-3">{solution.solution || 'Solution is yet to be provided'}</pre>
              </div>
            </div>
          ) : (
            <div className="card mb-4">
              <div className="card-body">
                <p className="card-text text-center">Solution is yet to be provided</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
