import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import QuestionDisplay from '../weeklyTest/weeklyTestStudentAnswerSubmission/QuestionDisplay';
import QuestionButtons from '../weeklyTest/weeklyTestStudentAnswerSubmission/QuestionButtons';
import FinalSubmissionButton from '../weeklyTest/weeklyTestStudentAnswerSubmission/FinalSubmissionButton';
import { baseURL } from '../config';
import WeeklyTestRules from '../weeklyTest/weeklyTestStudentAnswerSubmission/WeeklyTestRules';
import PaginationControls from '../weeklyTest/weeklyTestStudentAnswerSubmission/PaginationControls';
import DescriptiveTestData from './DescriptiveTestData';
import SaveStudentForm from './SaveStudentForm';

const StudentDescriptiveAnswerForm = () => {
  const { placement_test_id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [savedAnswers, setSavedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(-1); // Show rules page first
  const [finalSubmissionLoading, setFinalSubmissionLoading] = useState(false);
  const [totalMarks, setTotalMarks] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationAllowed, setLocationAllowed] = useState(false);

  // Ask for location permission
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationAllowed(true);
        },
        (error) => {
          alert("Location access is required to continue the test. Please allow location access.");
          setLocationAllowed(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLocationAllowed(false);
    }
  }, []);

  // Check if browser is Chrome
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isChromeBrowser = /Chrome/.test(userAgent) && !/Edge|Edg|OPR/.test(userAgent);
    if (!isChromeBrowser) {
      alert("This test is supported only in Google Chrome.");
      navigate('/chrome-only');
    }
  }, [navigate]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionsByPlacementTestId/${placement_test_id}`);
        setQuestions(response.data.questions);
        setTotalMarks(response.data.totalMarks);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [placement_test_id]);

  // Load saved answers from session storage
  useEffect(() => {
    const storedAnswers = JSON.parse(sessionStorage.getItem('unsavedAnswers')) || {};
    setAnswers(storedAnswers);
  }, []);

  // Fetch saved answers for the current question
  useEffect(() => {
    const fetchExistingAnswer = async () => {
      if (questions.length > 0 && currentPage >= 0) {
        const currentQuestion = questions[currentPage];
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

    fetchExistingAnswer();
  }, [currentPage, questions, placement_test_id]);

  // Handle editor changes
  const handleEditorChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
    setSavedAnswers((prevSaved) => ({ ...prevSaved, [questionId]: false }));
    sessionStorage.setItem('unsavedAnswers', JSON.stringify({ ...answers, [questionId]: value }));
  };

  // Save answer
  const handleSubmit = async (e, questionId) => {
    e.preventDefault();
    const answerArray = [{ question_id: Number(questionId), answer: answers[questionId] || '' }];
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${baseURL}/api/weekly-test/saveStudentAnswer`, { wt_id, answers: answerArray }, config);
      toast.success('Answer saved successfully!');
      setSavedAnswers((prevSaved) => ({ ...prevSaved, [questionId]: true }));
      sessionStorage.removeItem('unsavedAnswers');
    } catch (error) {
      toast.error(`Error saving answer: ${error.response?.data?.message || error.message}`);
    }
  };

  // Final Submission
  const handleFinalSubmission = async () => {
    if (!locationAllowed || !location.latitude || !location.longitude) {
      alert("Please allow location access before submitting the test.");
      return;
    }

    try {
      setFinalSubmissionLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(`${baseURL}/api/weekly-test/saveFinalSubmission`, {
        wt_id,
        latitude: location.latitude,
        longitude: location.longitude,
      }, config);

      toast.success('Final submission saved successfully!');
      setFinalSubmissionLoading(false);
      sessionStorage.removeItem('unsavedAnswers');
    } catch (error) {
      toast.error(`Error saving final submission: ${error.response?.data?.message || error.message}`);
      setFinalSubmissionLoading(false);
    }
  };

  if (!locationAllowed) {
    return (
      <Container className="text-center mt-5">
        <h3>⚠️ Location Access Required</h3>
        <p>Please allow location access in your browser settings to continue the test.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Container>
    );
  }

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>Error fetching questions: {error}</p>;

  return (
    <Container className="my-4" style={{ minHeight: '100vh' }}>
        <SaveStudentForm />
      <h5>Total Marks: {totalMarks}</h5>
      <DescriptiveTestData />
      <ToastContainer />
      {questions.length === 0 ? (
        <p>No questions found for this test.</p>
      ) : (
        <Row>
          <Col lg={9} md={8} className="pr-4" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            {currentPage === -1 ? <WeeklyTestRules /> : (
              <QuestionDisplay
                question={questions[currentPage]}
                answers={answers}
                handleEditorChange={handleEditorChange}
                handleSubmit={handleSubmit}
              />
            )}
          </Col>
          <Col lg={3} md={4} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            <PaginationControls currentPage={currentPage} handlePreviousPage={() => setCurrentPage(currentPage - 1)}
              handleNextPage={() => setCurrentPage(currentPage + 1)} totalQuestions={questions.length} />
            <QuestionButtons questions={questions} savedAnswers={savedAnswers} handlePageChange={setCurrentPage} />
            <FinalSubmissionButton handleFinalSubmission={handleFinalSubmission} finalSubmissionLoading={finalSubmissionLoading} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StudentDescriptiveAnswerForm;