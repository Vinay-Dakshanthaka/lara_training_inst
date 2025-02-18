import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Container, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import QuestionDisplay from './QuestionDisplay';
import PaginationControls from './PaginationControls';
import QuestionButtons from './QuestionButtons';
import FinalSubmissionButton from './FinalSubmissionButton';
import WeeklyTestRules from './WeeklyTestRules'; // Import the WeeklyTestRules component
import { baseURL } from '../../config';
import TestData from '../TestData';

const StudentAnswerForm = () => {
  const { wt_id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [savedAnswers, setSavedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(-1); // Start with -1 to show rules page by default
  const [finalSubmissionLoading, setFinalSubmissionLoading] = useState(false);
  const [totalMarks, setTotalMarks] = useState(null);

  // Check if the browser is Chrome
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isChromeBrowser = /Chrome/.test(userAgent) && !/Edge|Edg|OPR/.test(userAgent);

    if (!isChromeBrowser) {
      alert("This test is supported only in Google Chrome.");
      navigate('/chrome-only'); // Redirect to the Not Found page
    }
  }, [navigate]);

  const checkForGrammarly = () => {
    const grammarlyElement = document.querySelector('[data-grammarly-extension]');
    if (grammarlyElement) {
      alert('Grammarly is interfering with text input. Please disable it for the best experience.');
    }
  };

  setInterval(checkForGrammarly, 2000);


  // Fetch questions for the weekly test
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionsByWeeklyTestId/${wt_id}`);
        setQuestions(response.data.questions);
        setTotalMarks(response.data.totalMarks);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [wt_id]);

  // Load previously stored answers from session storage
  useEffect(() => {
    const storedAnswers = JSON.parse(sessionStorage.getItem('unsavedAnswers')) || {};
    setAnswers(storedAnswers);
  }, []);

  // Fetch the saved answer for the current question
  useEffect(() => {
    const fetchExistingAnswer = async () => {
      const currentQuestion = questions[currentPage];
      if (currentQuestion) {
        try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get(`${baseURL}/api/weekly-test/getStudentAnswer/${wt_id}/${currentQuestion.wt_question_id}`, config);
          if (response.data.answer) {
            setAnswers((prevAnswers) => ({
              ...prevAnswers,
              [currentQuestion.wt_question_id]: response.data.answer,
            }));
            setSavedAnswers((prevSaved) => ({
              ...prevSaved,
              [currentQuestion.wt_question_id]: true,
            }));
          }
        } catch (error) {
          console.error(`Error fetching existing answer: ${error.message}`);
        }
      }
    };

    if (questions.length > 0 && currentPage >= 0) {
      fetchExistingAnswer();
    }
  }, [currentPage, questions, wt_id]);

  // Handle editor changes
  const handleEditorChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));

    setSavedAnswers((prevSaved) => ({
      ...prevSaved,
      [questionId]: false,
    }));

    sessionStorage.setItem('unsavedAnswers', JSON.stringify({
      ...answers,
      [questionId]: value,
    }));
  };

  // Handle saving the answer
  const handleSubmit = async (e, questionId) => {
    e.preventDefault();
    const answerArray = [{ question_id: Number(questionId), answer: answers[questionId] || '' }];
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log(config,"-------------config");
        console.log( wt_id,"----------",  answerArray,"-------------------------------------")
      await axios.post(`${baseURL}/api/weekly-test/saveStudentAnswer`, { wt_id, answers: answerArray }, config);
      toast.success('Answer saved successfully!');

      setSavedAnswers((prevSaved) => ({
        ...prevSaved,
        [questionId]: true,
      }));

      sessionStorage.removeItem('unsavedAnswers');
    } catch (error) {
      toast.error(`Error saving answer: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle final submission
  const handleFinalSubmission = async () => {
    try {
      setFinalSubmissionLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(`${baseURL}/api/weekly-test/saveFinalSubmission`, { wt_id }, config);
      toast.success('Final submission saved successfully!');
      setFinalSubmissionLoading(false);

      sessionStorage.removeItem('unsavedAnswers');
    } catch (error) {
      toast.error(`Error saving final submission: ${error.response?.data?.message || error.message}`);
      setFinalSubmissionLoading(false);
    }
  };

  // Track answered questions
  const answeredQuestions = questions.reduce((acc, question) => {
    acc[question.wt_question_id] = savedAnswers[question.wt_question_id] || false;
    return acc;
  }, {});

  // Handle page change
  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>Error fetching questions: {error}</p>;
  }

  const currentQuestion = currentPage === -1 ? null : questions[currentPage];

  return (
    <Container className="my-4" style={{ minHeight: '100vh' }}>
      <h5>Total Marks : {totalMarks}</h5>
      <TestData />
      <ToastContainer />
      {questions.length === 0 ? (
        <p>No questions found for this test.</p>
      ) : (
        <Row>
          {/* Scrollable Question Display or Rules */}
          <Col lg={9} md={8} className="pr-4" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            {currentPage === -1 ? (
              <WeeklyTestRules /> // Render rules if the "0" button is clicked
            ) : (
              <QuestionDisplay
                question={currentQuestion}
                answers={answers}
                handleEditorChange={handleEditorChange}
                handleSubmit={handleSubmit}
              />
            )}
          </Col>

          {/* Scrollable Pagination and Buttons */}
          <Col lg={3} md={4} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            <PaginationControls
              currentPage={currentPage}
              handlePreviousPage={() => setCurrentPage(currentPage - 1)}
              handleNextPage={() => setCurrentPage(currentPage + 1)}
              totalQuestions={questions.length}
            />

            <QuestionButtons
              questions={questions}
              savedAnswers={savedAnswers}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              answeredQuestions={answeredQuestions}
            />

            <FinalSubmissionButton
              handleFinalSubmission={handleFinalSubmission}
              finalSubmissionLoading={finalSubmissionLoading}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StudentAnswerForm;
