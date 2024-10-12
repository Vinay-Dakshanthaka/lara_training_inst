import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { baseURL } from '../config';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const StudentAnswerForm = () => {
  const { wt_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // Keep answers state for current session
  const [savedAnswers, setSavedAnswers] = useState({}); // Keep track of saved answers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [finalSubmissionLoading, setFinalSubmissionLoading] = useState(false);
  const quillRef = useRef(null);

  useEffect(() => {
    // Fetch questions
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionsByWeeklyTestId/${wt_id}`);
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [wt_id]);

  // Restore answers from sessionStorage when component mounts
  useEffect(() => {
    const storedAnswers = JSON.parse(sessionStorage.getItem('unsavedAnswers')) || {};
    setAnswers(storedAnswers);
  }, []);

  // Fetch saved answer when the user moves to a new question
  useEffect(() => {
    const fetchExistingAnswer = async () => {
      const currentQuestion = questions[currentPage];
      if (currentQuestion) {
        try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get(`${baseURL}/api/weekly-test/getStudentAnswer/${wt_id}/${currentQuestion.wt_question_id}`, config);

          // Update the answers state with saved answer from backend
          if (response.data.answer) {
            setAnswers((prevAnswers) => ({
              ...prevAnswers,
              [currentQuestion.wt_question_id]: response.data.answer,
            }));

            // Mark the answer as saved
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

    if (questions.length > 0) {
      fetchExistingAnswer();
    }
  }, [currentPage, questions, wt_id]);

  // Handle Quill editor change
  const handleEditorChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));

    // Mark answer as unsaved (yellow) when it's edited
    setSavedAnswers((prevSaved) => ({
      ...prevSaved,
      [questionId]: false,
    }));

    // Store temporary answer in sessionStorage
    sessionStorage.setItem('unsavedAnswers', JSON.stringify({
      ...answers,
      [questionId]: value,
    }));
  };

  // Handle form submission to save answer
  const handleSubmit = async (e, questionId) => {
    e.preventDefault();

    const answerArray = [{ question_id: Number(questionId), answer: answers[questionId] || '' }];
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(`${baseURL}/api/weekly-test/saveStudentAnswer`, { wt_id, answers: answerArray }, config);
      toast.success('Answer saved successfully!');

      // Mark the answer as saved (green) after saving
      setSavedAnswers((prevSaved) => ({
        ...prevSaved,
        [questionId]: true,
      }));

      // Remove unsaved answer from sessionStorage after saving
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
      
      // Clear unsaved answers from sessionStorage
      sessionStorage.removeItem('unsavedAnswers');
    } catch (error) {
      toast.error(`Error saving final submission: ${error.response?.data?.message || error.message}`);
      setFinalSubmissionLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // Loading and error handling
  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>Error fetching questions: {error}</p>;
  }

  const currentQuestion = questions[currentPage];

  // Get button color based on answer state
  const getButtonColor = (questionId) => {
    if (savedAnswers[questionId]) {
      return 'success'; // Green for saved
    } else if (answers[questionId]) {
      return 'warning'; // Yellow for unsaved
    } else {
      return 'danger'; // Red for unanswered
    }
  };

  return (
    <Container className="my-4">
      <ToastContainer />
      <h2>Weekly Test Questions</h2>
      {questions.length === 0 ? (
        <p>No questions found for this test.</p>
      ) : (
        <Row>
          <Col lg={8} md={7} className="pr-4">
            <form onSubmit={(e) => handleSubmit(e, currentQuestion.wt_question_id)}>
              <div key={currentQuestion.wt_question_id} className="mb-4">
                <h5>Question {currentPage + 1}:</h5>
                <pre>{currentQuestion.wt_question_description}</pre>

                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={answers[currentQuestion.wt_question_id] || ''}
                  onChange={(value) => handleEditorChange(currentQuestion.wt_question_id, value)}
                />

                <Button variant="primary" type="submit" className="mt-3">
                  Save/Update Answer
                </Button>
              </div>
            </form>
          </Col>

          <Col lg={4} md={5}>
            <Row className="mb-4">
              <Col>
                <Button
                  variant="secondary"
                  disabled={currentPage === 0}
                  onClick={handlePreviousPage}
                >
                  Previous
                </Button>
              </Col>
              <Col className="text-right">
                <Button
                  variant="secondary"
                  disabled={currentPage === questions.length - 1}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <div className="d-flex flex-wrap">
                  {questions.map((question, index) => (
                    <Button
                      key={index}
                      variant={getButtonColor(question.wt_question_id)}
                      className="mr-2 mb-2"
                      onClick={() => handlePageChange(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  variant="danger"
                  className="btn-block"
                  onClick={handleFinalSubmission}
                  disabled={finalSubmissionLoading}
                >
                  {finalSubmissionLoading ? 'Submitting...' : 'Submit Final'}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StudentAnswerForm;
